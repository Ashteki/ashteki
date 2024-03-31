const { CardType } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class HorrificGaze extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => card.type === CardType.Phoenixborn,
            targetController: 'opponent',
            effect: [ability.effects.exhausted(), ability.effects.cardCannot('guard')]
        });
    }
}

HorrificGaze.id = 'horrific-gaze';

module.exports = HorrificGaze;
