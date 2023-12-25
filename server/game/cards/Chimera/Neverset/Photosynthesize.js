const { Magic } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Photosynthesize extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            inexhaustible: true,
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            cost: [ability.costs.loseStatus(1)],
            gameAction: ability.actions.raiseDie((context) => ({
                target: context.source.owner.getBasicDie(Magic.Rage),
                showMessage: true
            }))

        });
    };

    get statusCount() {
        return 3;
    }
}

Photosynthesize.id = 'photosynthesize';

module.exports = Photosynthesize;
