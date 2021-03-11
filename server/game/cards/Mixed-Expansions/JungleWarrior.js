const Card = require('../../Card.js');

class JungleWarrior extends Card {
    setupCardAbilities() {
        this.inheritance();
    }
}

JungleWarrior.id = 'jungle-warrior';

module.exports = JungleWarrior;
