const Card = require('../../Card.js');

class EmperorLion extends Card {
    setupCardAbilities(ability) {
        this.alert();
        this.persistentEffect({
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }
}

EmperorLion.id = 'emperor-lion';

module.exports = EmperorLion;
