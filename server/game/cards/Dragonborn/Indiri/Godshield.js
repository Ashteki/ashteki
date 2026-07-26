const AspectCard = require('../../../solo/AspectCard');

class Godshield extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.modifyArmor(1)
        });
    }
}

Godshield.id = 'godshield';

module.exports = Godshield;
