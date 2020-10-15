const Card = require('../../Card.js');

class RootArmor extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyLife(1)
        });
    }
}

RootArmor.id = 'root-armor';

module.exports = RootArmor;
