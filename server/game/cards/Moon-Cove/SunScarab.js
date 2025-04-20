const Card = require('../../Card.js');

class SunScarab extends Card {
    setupCardAbilities(ability) {
        this.stalk();
    }
}

SunScarab.id = 'sun-scarab';

module.exports = SunScarab;
