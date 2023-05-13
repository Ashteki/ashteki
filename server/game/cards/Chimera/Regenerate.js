const { Level } = require("../../../constants");
const AspectCard = require("../../solo/AspectCard");

class Regenerate extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedInterrupt({
            inexhaustible: true,
            title: 'Regenerate',
            when: {
                whenCardDestroyed: (event, context) =>
                    event.triggeringEvent &&
                    event.triggeringEvent.name === 'onCardDestroyed' &&
                    event.card === context.source
            },
            target: {
                toSelect: 'die',
                autoTarget: (context) => context.source.owner.dice.find(d => d.level === Level.Basic),
                gameAction: ability.actions.rerollDice()
            },
            then: {
                alwaysTriggers: true,
                gameAction:
                    ability.actions.conditional({
                        condition: (context) => context.preThenEvent.dice[0].level === Level.Basic,
                        trueGameAction:
                            [
                                ability.actions.changeEvent((context) => ({
                                    event: context.preThenEvent.context.event.leavesPlayEvent,
                                    handler: () => true
                                })),
                                ability.actions.removeFromBattle((context) => ({
                                    target: context.source,
                                    forceRemoval: true
                                })),
                                ability.actions.purge(),
                                ability.actions.addEventToWindow((context) => ({
                                    subEvent: true,
                                    targetEvent: context.preThenEvent.context.event,
                                    eventToAdd: this.getPlayEvent(ability, context)
                                }))
                            ]
                    })
            }
        });
    }

    getPlayEvent(ability, context) {
        const event = ability.actions
            .putIntoPlay()
            .getEvent(context.source, context);
        event.addSubEvent(ability.actions.exhaust().getEvent(context.source, context));
        return event;
    }
}

Regenerate.id = 'regenerate';

module.exports = Regenerate