const Card = require('../../Card.js');

class VoidPhantom extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(() => this.exhausted ? this.getAbilityNumeric(1) : 0)
        });
    }
}

VoidPhantom.id = 'void-phantom';

module.exports = VoidPhantom;