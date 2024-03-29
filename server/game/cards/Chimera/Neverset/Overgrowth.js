const AspectCard = require('../../../solo/AspectCard');

class Overgrowth extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }
}

Overgrowth.id = 'overgrowth';

module.exports = Overgrowth;
