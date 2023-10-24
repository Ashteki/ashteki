const AspectCard = require('../../../solo/AspectCard');

class FrostBulwark extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        // armored 1
        this.persistentEffect({
            effect: ability.effects.modifyArmor(1)
        });
    }
}

FrostBulwark.id = 'frost-bulwark';

module.exports = FrostBulwark;
