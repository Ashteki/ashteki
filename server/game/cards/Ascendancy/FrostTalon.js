const Card = require('../../Card.js');

class FrostTalon extends Card {
    setupCardAbilities(ability) {
        this.stalk();
    }
}

FrostTalon.id = 'frost-talon';

module.exports = FrostTalon;
