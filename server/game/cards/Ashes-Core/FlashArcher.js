const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BloodArcher extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Double Shot',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                target: {
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                }
            }
        });
    }
}

BloodArcher.id = 'blood-archer';

module.exports = BloodArcher;
