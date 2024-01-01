const AspectCard = require('../../../solo/AspectCard');

class SoothingScent extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();
        this.tame(1);
    }

}

SoothingScent.id = 'soothing-scent';

module.exports = SoothingScent;
