const { Level } = require("../../../constants");
const AspectCard = require("../../solo/AspectCard");

class Regenerate extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.destroyed({
            inexhaustible: true,
            title: 'Regenerate',
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
                                ability.actions.removeFromBattle((context) => ({
                                    target: context.source,
                                    forceRemoval: true
                                })),
                                ability.actions.purge(),
                                ability.actions.addEventToWindow((context) => ({
                                    subEvent: true,
                                    targetEvent: context.preThenEvent.context.event,
                                    eventToAdd: ability.actions
                                        .putIntoPlay()
                                        .getEvent(context.source, context)
                                }))
                            ]
                    })
            }
        });

        this.defender()
    }
}

Regenerate.id = 'regenerate';

module.exports = Regenerate