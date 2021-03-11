const Card = require('../../Card.js');

class Gilder extends Card {
    setupCardAbilities() {
        this.unitGuard();

        this.inheritance();
    }
}

Gilder.id = 'gilder';

module.exports = Gilder;
