const AspectCard = require('../../../solo/AspectCard');

class WhistlingArrow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 1 })
        });

        this.ephemeral();
    }

}

WhistlingArrow.id = 'whistling-arrow';

module.exports = WhistlingArrow;
