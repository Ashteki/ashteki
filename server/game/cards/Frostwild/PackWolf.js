const Card = require('../../Card.js');

class PackWolf extends Card {
    setupCardAbilities(ability) {
        this.fade();
    }
}

PackWolf.id = 'pack-wolf';

module.exports = PackWolf;
