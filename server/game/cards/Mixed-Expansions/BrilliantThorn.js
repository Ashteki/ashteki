const Card = require('../../Card.js');

class BrilliantThorn extends Card {
    setupCardAbilities() {
        this.fade();

        this.inheritance(); // 1
    }
}

BrilliantThorn.id = 'brilliant-thorn';

module.exports = BrilliantThorn;
