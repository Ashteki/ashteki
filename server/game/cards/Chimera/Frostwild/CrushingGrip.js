const AspectCard = require('../../../solo/AspectCard');

class CrushingGrip extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        // armored 1
        this.persistentEffect({
            match: (card) => card.controller.indexOf(card) === 0,
            targetController: 'opponent',
            effect: ability.effects.exhausted()
        });
    }
}

CrushingGrip.id = 'crushing-grip';

module.exports = CrushingGrip;
