const AspectCard = require('../../../solo/AspectCard');

class Lunge extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Lunge',
            gameAction: ability.actions.rollBehaviourDie(),
            then: {
                gameAction: ability.actions.resolveBehaviourSide((context) => ({
                    behaviourNum: Math.min(context.priorContext.dieResult + 3, 12)
                }))
            }
        });

        this.retreat();
    }
}

Lunge.id = 'lunge';

module.exports = Lunge;
