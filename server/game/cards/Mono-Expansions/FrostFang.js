const Card = require('../../Card.js');

class FrostFang extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(() => this.getAbilityNumeric(1))
        });
    }
}

FrostFang.id = 'frost-fang';

module.exports = FrostFang;
