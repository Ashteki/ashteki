const Card = require('../../Card.js');

class BeastWarrior extends Card {
    setupCardAbilities() {
        this.groupTactics(1);

        this.transform({ amount: 1 });
    }
}

BeastWarrior.id = 'beast-warrior';

module.exports = BeastWarrior;
