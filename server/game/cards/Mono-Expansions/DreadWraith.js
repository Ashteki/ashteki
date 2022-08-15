const Card = require('../../Card.js');

class DreadWraith extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyAttack(() => this.getAbilityNumeric(this.damage))
        });
    }
}

DreadWraith.id = 'dread-wraith';

module.exports = DreadWraith;
