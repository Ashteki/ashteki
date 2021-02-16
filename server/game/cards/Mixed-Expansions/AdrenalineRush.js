const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class AdrenalineRush extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage and remove 1 exhaustion',
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: [
                    ability.actions.dealDamage({ amount: 1 }),
                    ability.actions.removeExhaustion({ amount: 1 })
                ]
            }
        });
    }
}

AdrenalineRush.id = 'adrenaline-rush';

module.exports = AdrenalineRush;
