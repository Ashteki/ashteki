const Card = require('../../Card.js');

class JamesEndersight extends Card {
    setupCardAbilities(ability) {
        return this.action({
            title: 'Convene with Souls',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                optional: true,
                controller: 'self',
                cardType: 'Ally',
                location: 'deck',
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.moveCard({ destination: 'hand', showMessage: true }),
                    ability.actions.addDamageToken((context) => ({
                        amount: context.target?.life || 0,
                        target: context.player.phoenixborn,
                        showMessage: true,
                        shortMessage: true
                    }))
                ]
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.shuffleDeck()
            },

            message: '{0} uses {1} to Convene with Souls',
            messageArgs: (context) => [context.player, context.source]
        });
    }
}

JamesEndersight.id = 'james-endersight';

module.exports = JamesEndersight;
