const Card = require('../../Card.js');

class FireArcher extends Card {
    setupCardAbilities() {
        this.ambush(1);
    }
}

FireArcher.id = 'fire-archer';

module.exports = FireArcher;
