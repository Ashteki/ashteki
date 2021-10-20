const Card = require('../../Card.js');

class BeastWarrior extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ grouptactics: 1 })
        });

        this.transform({ amount: 1 });
    }
}

BeastWarrior.id = 'beast-warrior';

module.exports = BeastWarrior;
