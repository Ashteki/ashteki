const Card = require('../../Card.js');

class FrostbackBear extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 1 })
        });
    }
}

FrostbackBear.id = 'frostback-bear';

module.exports = FrostbackBear;
