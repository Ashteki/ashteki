const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FalseDemon extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Nightmare 1',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.dealDamage({
                    amount: 1,
                    message: true
                })
            }
        });
    }
}

FalseDemon.id = 'false-demon';

module.exports = FalseDemon;
