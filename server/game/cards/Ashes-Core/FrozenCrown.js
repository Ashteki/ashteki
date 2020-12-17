const Card = require('../../Card.js');

class FrozenCrown extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyAttack(3)
        });
    }
}

FrozenCrown.id = 'frozen-crown';

module.exports = FrozenCrown;
