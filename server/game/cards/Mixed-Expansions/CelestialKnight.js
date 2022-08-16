const Card = require('../../Card.js');

class CelestialKnight extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(() => this.getAbilityNumeric(1))
        });
    }
}

CelestialKnight.id = 'celestial-knight';

module.exports = CelestialKnight;
