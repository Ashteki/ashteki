const Card = require('../../Card.js');

class IceBuff extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyLife(1)]
        });
    }
}

IceBuff.id = 'ice-buff';

module.exports = IceBuff;
