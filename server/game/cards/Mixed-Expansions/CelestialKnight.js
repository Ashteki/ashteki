const Card = require('../../Card.js');

class CelestialKnight extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor(1)
        });
    }
}

CelestialKnight.id = 'celestial-knight';

module.exports = CelestialKnight;
