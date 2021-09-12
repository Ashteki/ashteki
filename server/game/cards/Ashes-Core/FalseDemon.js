const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FalseDemon extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            effect: 'deal 1 damage to {0}',
            target: {
                optional: true,
                activePromptTitle: 'Nightmare 1',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.dealDamage({
                    amount: 1
                })
            }
        });
    }
}

FalseDemon.id = 'false-demon';

module.exports = FalseDemon;
