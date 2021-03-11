const Card = require('../../Card.js');

class PantherSpirit extends Card {
    setupCardAbilities() {
        this.fleeting();
    }
}

PantherSpirit.id = 'panther-spirit';

module.exports = PantherSpirit;
