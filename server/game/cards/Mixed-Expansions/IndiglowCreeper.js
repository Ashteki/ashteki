const Card = require('../../Card.js');

class IndiglowCreeper extends Card {
    setupCardAbilities(ability) {
        this.fade();

        this.destroyed({
            target: {
                activePromptTitle: 'Germinate',
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'luminous-seedling',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

IndiglowCreeper.id = 'indiglow-creeper';

module.exports = IndiglowCreeper;
