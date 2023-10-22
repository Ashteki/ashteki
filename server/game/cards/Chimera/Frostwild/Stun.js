const Card = require('../../../Card.js');

class Stun extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.exhausted()]
        });
    }
}

Stun.id = 'stun';

module.exports = Stun;
