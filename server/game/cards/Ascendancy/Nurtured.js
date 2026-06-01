const Card = require('../../Card.js');

class Nurtured extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyLife(1)]
        });
    }
}

Nurtured.id = 'nurtured';

module.exports = Nurtured;
