const AspectCard = require('../../../solo/AspectCard');

class Oppress extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            target: {
                mode: 'auto',
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.exhaust()
            }
        });

    }
}

Oppress.id = 'oppress';

module.exports = Oppress;
