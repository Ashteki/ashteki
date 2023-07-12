const Card = require('../../Card.js');

class IceAdaptation extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyLife(1)]
        });
    }
}

IceAdaptation.id = 'ice-adaptation';

module.exports = IceAdaptation;
