const Card = require('../../Card.js');

class Glaciate extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [ability.effects.exhausted(), ability.effects.preventAllDamage()]
        });

        this.fleeting();
    }
}

Glaciate.id = 'glaciate';

module.exports = Glaciate;
