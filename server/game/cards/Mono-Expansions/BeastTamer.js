const Card = require('../../Card.js');

class BeastTamer extends Card {
    setupCardAbilities() {
        this.alert();

        this.tame({ amount: 1 });
    }
}

BeastTamer.id = 'beast-tamer';

module.exports = BeastTamer;
