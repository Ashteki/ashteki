const Card = require('../../Card.js');

class PowerThrough extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1), ability.effects.addKeyword({ overkill: 1 })]
        });
    }
}

PowerThrough.id = 'power-through';

module.exports = PowerThrough;
