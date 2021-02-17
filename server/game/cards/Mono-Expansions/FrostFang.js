const Card = require('../../Card.js');

class FrostFang extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(1)
        });
    }
}

FrostFang.id = 'frost-fang';

module.exports = FrostFang;
