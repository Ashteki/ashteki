const Card = require('../../Card.js');

class SalamanderMonkSpirit extends Card {
    setupCardAbilities() {
        this.fleeting();
    }
}

SalamanderMonkSpirit.id = 'salamander-monk-spirit';

module.exports = SalamanderMonkSpirit;
