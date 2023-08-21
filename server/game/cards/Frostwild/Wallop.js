const Card = require('../../Card.js');

class Wallop extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyAttack(2)
        });
    }
}

Wallop.id = 'wallop';

module.exports = Wallop;
