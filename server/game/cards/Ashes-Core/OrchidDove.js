const Card = require('../../Card.js');

class OrchidDove extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            optional: true,
            gameAction: ability.actions.discardTopOfDeck()
        });
    }
}

OrchidDove.id = 'orchid-dove';

module.exports = OrchidDove;
