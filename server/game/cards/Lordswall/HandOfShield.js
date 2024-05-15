const Card = require('../../Card.js');

class HandOfShield extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();
    }
}

HandOfShield.id = 'hand-of-shield';

module.exports = HandOfShield;
