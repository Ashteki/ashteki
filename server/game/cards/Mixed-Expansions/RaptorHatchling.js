const Card = require('../../Card.js');

class RaptorHatchling extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ grouptactics: 2 })
        });
    }
}

RaptorHatchling.id = 'raptor-hatchling';

module.exports = RaptorHatchling;
