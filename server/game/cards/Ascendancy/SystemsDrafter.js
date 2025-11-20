const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SystemsDrafter extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Rethink',
            target: {
                cardType: CardType.ReadySpell,
                controller: 'self',
                activePromptTitle: 'Choose a unit to remove exhaustion from',
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.removeExhaustion()
            }
        });
    }
}

SystemsDrafter.id = 'systems-drafter';

module.exports = SystemsDrafter;
