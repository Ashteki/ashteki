const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class VampireBatSwarm extends Card {
    setupCardAbilities(ability) {
        this.groupTactics(1);


        this.forcedInterrupt({
            autoResolve: true,
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.triggeringEvent &&
                    event.triggeringEvent.name === 'onCardDestroyed' &&
                    event.card === context.source
            },
            may: 'activate Swarm',
            cost: ability.costs.dice(
                [
                    [
                        new DiceCount(1, Level.Class, Magic.Ceremonial),
                        new DiceCount(1, Level.Class, Magic.Sympathy)
                    ]
                ]
            ),
            gameAction: [
                ability.actions.removeFromBattle((context) => ({
                    target: context.source,
                    forceRemoval: true
                })),
                ability.actions.addEventToWindow((context) => ({
                    subEvent: true,
                    targetEvent: context.event,
                    eventToAdd: ability.actions
                        .putIntoPlay()
                        .getEvent(context.source, context)
                }))
            ],
            effect: 'place {0} on their battlefield'
        });
    }
}

VampireBatSwarm.id = 'vampire-bat-swarm';

module.exports = VampireBatSwarm;
