const Card = require('../../Card.js');

class OrchidDove extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            title: 'Last Request 1',
            may: 'force your opponent to discard the top card of their deck',
            gameAction: ability.actions.discardTopOfDeck(() => ({
                amount: this.getAbilityNumeric(1)
            }))
        });
    }
}

OrchidDove.id = 'orchid-dove';

module.exports = OrchidDove;
