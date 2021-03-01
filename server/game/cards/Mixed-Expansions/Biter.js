const Card = require('../../Card.js');

class Biter extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        this.persistentEffect({
            effect: ability.effects.cardCannot('attack')
        });
    }
}

Biter.id = 'biter';

module.exports = Biter;
