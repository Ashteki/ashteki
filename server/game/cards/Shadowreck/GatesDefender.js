const Card = require('../../Card.js');

class GatesDefender extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.hidden();
    }
}

GatesDefender.id = 'gates-defender';

module.exports = GatesDefender;
