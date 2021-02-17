const Card = require('../../Card.js');

class OrchidDove extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            title: 'Last Request 1',
            may: 'force opponent to discard top of deck',
            gameAction: ability.actions.discardTopOfDeck()
        });
    }
}

OrchidDove.id = 'orchid-dove';

module.exports = OrchidDove;
