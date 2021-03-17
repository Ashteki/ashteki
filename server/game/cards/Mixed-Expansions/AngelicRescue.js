const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class AngelicRescue extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    event.context.player === context.player.opponent && // opponent action
                    BattlefieldTypes.includes(event.card.type) && // its a unit
                    !event.fightEvent // not a fight
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            })),
            then: (context) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.removeDamage({
                    target: context.event.card,
                    all: true
                })
            }),
            message: '{0} plays {1} to prevent all damage to {2} then removes all wounds',
            messageArgs: (context) => [context.player, context.source, context.event.card]
        });
    }
}

AngelicRescue.id = 'angelic-rescue';

module.exports = AngelicRescue;
