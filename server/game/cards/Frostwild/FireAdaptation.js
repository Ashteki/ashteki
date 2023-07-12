const Card = require('../../Card.js');

class FireAdaptation extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
        });
    }
}

FireAdaptation.id = 'fire-adaptation';

module.exports = FireAdaptation;
