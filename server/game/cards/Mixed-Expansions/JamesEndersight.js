const Card = require('../../Card.js');

class JamesEndersight extends Card {
    setupCardAbilities(ability) {
        return this.action({
            title: 'Convene with Souls',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                controller: 'self',
                cardType: 'Ally',
                location: 'deck',
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.moveCard({ destination: 'hand' }),
                    ability.actions.addDamageToken((context) => ({
                        amount: context.target.life,
                        target: context.player.phoenixborn
                    }))
                ]
            },
            then: {
                gameAction: ability.actions.shuffleDeck()
            },
            message: '{0} uses {1} to move {2} from deck to hand, then takes {3} wounds',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.target,
                context.target.life
            ]
        });
    }
}

JamesEndersight.id = 'james-endersight';

module.exports = JamesEndersight;
