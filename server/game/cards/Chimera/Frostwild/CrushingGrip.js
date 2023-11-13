const AspectCard = require('../../../solo/AspectCard');

class CrushingGrip extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        // treat leftmost as exhausted
        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => card.controller.indexOf(card) === 0,
            targetController: 'opponent',
            effect: ability.effects.exhausted()
        });
    }
}

CrushingGrip.id = 'crushing-grip';

module.exports = CrushingGrip;
