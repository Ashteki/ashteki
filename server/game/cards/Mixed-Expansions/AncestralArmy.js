const Card = require('../../Card.js');

class AncestralArmy extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                activePromptTitle: 'Invoke Ancestors',
                controller: 'self',
                cardType: 'Conjuration',
                mode: 'upTo',
                numCards: 2,
                cardCondition: (card) => card.id === 'ancestor-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

AncestralArmy.id = 'ancestral-army';

module.exports = AncestralArmy;
