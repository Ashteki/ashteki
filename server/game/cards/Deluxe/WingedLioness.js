const Card = require('../../Card.js');

class WingedLioness extends Card {
    setupCardAbilities() {
        this.stalk();
    }
}

WingedLioness.id = 'winged-lioness';

module.exports = WingedLioness;
