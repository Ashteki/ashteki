const Card = require('../../Card.js');

class CrystalShield extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyLife(2), ability.effects.canGuard()]
        });
    }
}

CrystalShield.id = 'crystal-shield';

module.exports = CrystalShield;
