const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RedFlower extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'remove all tokens from a target unit',
            target: {
                activePromptTitle: 'Choose a unit to remove all tokens from',
                controller: 'self',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.status > 0 || card.upgrades.length > 0,
                gameAction: ability.actions.removeAllTokens()
            },
            then: (context) => ({
                condition: context.tokensRemoved >= 3,
                target: {
                    activePromptTitle: 'Choose a card to deal 1 damage to',
                    controller: 'opponent',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({
                        amount: 1,
                        showMessage: true
                    })
                }
            })
        });
    }
}

RedFlower.id = 'red-flower';

module.exports = RedFlower;
