const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FlashArcher extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Double Shot',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                target: {
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({ showMessage: true }),
                    optional: true
                }
            }
        });
    }
}

FlashArcher.id = 'flash-archer';

module.exports = FlashArcher;
