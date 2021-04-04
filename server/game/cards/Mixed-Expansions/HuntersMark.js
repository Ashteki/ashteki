const Card = require('../../Card.js');

class HuntersMark extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.multiplyDamage(2), ability.effects.cannotBeGuarded()]
        });
    }
}

HuntersMark.id = 'hunters-mark';

module.exports = HuntersMark;
