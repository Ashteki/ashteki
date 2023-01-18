const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class OdetteDiamondcrest extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Enter the Fray',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'any',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.dealDamage({
                    amount: preThenContext.target.attack,
                    target: preThenContext.player.phoenixborn,
                    showMessage: true
                })
            })
        });
    }
}

OdetteDiamondcrest.id = 'odette-diamondcrest';

module.exports = OdetteDiamondcrest;
