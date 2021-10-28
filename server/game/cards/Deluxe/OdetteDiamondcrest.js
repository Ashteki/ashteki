const Card = require('../../Card.js');

class OdetteDiamondcrest extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Enter the Fray',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            target: {
                cardType: ['Ally', 'Conjuration'],
                controller: 'any',
                gameAction: [
                    ability.actions.dealDamage({ amount: 2 }),
                    ability.actions.dealDamage((context) => ({
                        amount: context.target.attack,
                        target: context.player.phoenixborn,
                        showMessage: true
                    }))
                ]
            }
        });
    }
}

OdetteDiamondcrest.id = 'odette-diamondcrest';

module.exports = OdetteDiamondcrest;
