const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EnchantedViolinist extends Card {
    setupCardAbilities(ability) {
        this.action({
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            effect: 'deal 1 damage',
            target: {
                cardType: [...BattlefieldTypes],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                message: '!! MANUAL OPPONENT DISCARD !!'
            }
        });
    }
}

EnchantedViolinist.id = 'enchanted-violinist';

module.exports = EnchantedViolinist;
