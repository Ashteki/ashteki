const Card = require('../../Card.js');

class Fallen extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.unpreventable()
        });
    }
}

Fallen.id = 'fallen';

module.exports = Fallen;
