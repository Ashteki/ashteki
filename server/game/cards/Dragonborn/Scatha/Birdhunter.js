const AspectCard = require('../../../solo/AspectCard');

class Birdhunter extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }

}

Birdhunter.id = 'birdhunter';

module.exports = Birdhunter;
