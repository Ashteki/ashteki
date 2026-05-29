const Card = require('../../Card.js');

class EagleFledgling extends Card {
    setupCardAbilities(ability) {
        this.uplift();
    }
}

EagleFledgling.id = 'eagle-fledgling';

module.exports = EagleFledgling;
