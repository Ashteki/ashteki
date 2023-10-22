const AspectCard = require('../../../solo/AspectCard');

class FrostBullwark extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        // armored 1
        this.persistentEffect({
            effect: ability.effects.modifyArmor(1)
        });
    }
}

FrostBullwark.id = 'frost-bullwark';

module.exports = FrostBullwark;
