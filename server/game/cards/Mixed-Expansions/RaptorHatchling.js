const Card = require('../../Card.js');

class RaptorHatchling extends Card {
    setupCardAbilities() {
        this.groupTactics(2);
    }
}

RaptorHatchling.id = 'raptor-hatchling';

module.exports = RaptorHatchling;
