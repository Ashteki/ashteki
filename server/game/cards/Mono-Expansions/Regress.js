const Card = require('../../Card.js');

class Regress extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyAttack(-3)
        });

        this.fleeting();
    }
}

Regress.id = 'regress';

module.exports = Regress;
