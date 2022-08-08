const Card = require('../../Card.js');

class RebornChimera extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ overkill: 3 })
        });
    }
}

RebornChimera.id = 'reborn-chimera';

module.exports = RebornChimera;
