const AspectCard = require('../../../solo/AspectCard');

class Unfathomable extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 2 })
        });
    }
}

Unfathomable.id = 'unfathomable';

module.exports = Unfathomable;
