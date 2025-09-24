const Card = require('../../Card.js');

class RubbleSpirit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.discardTopOfDeck(() => ({
                amount: this.getAbilityNumeric(1)
            }))
        });
    }
}

RubbleSpirit.id = 'rubble-spirit';

module.exports = RubbleSpirit;
