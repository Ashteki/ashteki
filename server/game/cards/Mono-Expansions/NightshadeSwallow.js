const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class NightshadeSwallow extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                optional: true,
                activePromptTitle: 'Pacify 1',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.exhaust(() => ({
                    amount: this.getAbilityNumeric(1)
                }))
            }
        });
    }
}

NightshadeSwallow.id = 'nightshade-swallow';

module.exports = NightshadeSwallow;
