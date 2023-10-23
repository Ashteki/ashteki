const Card = require('../../../Card.js');

class Vigor extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
            //TODO: enrage 1 ability
        });
    }
}

Vigor.id = 'vigor';

module.exports = Vigor;
