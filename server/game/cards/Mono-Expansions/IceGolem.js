const Card = require('../../Card.js');

class IceGolem extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.upgrades.length > 0,
            effect: ability.effects.modifyLife(2)
        });
    }
}

IceGolem.id = 'ice-golem';

module.exports = IceGolem;
