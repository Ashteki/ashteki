const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ToShadows extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose an exhausted unit to discard',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.discard()
            }
        });
    }
}

ToShadows.id = 'to-shadows';

module.exports = ToShadows;
