const AspectCard = require('../../../solo/AspectCard');

class Overgrowth extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterSelfOrAdjacentDestroysFighting({
            autoResolve: true,
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({ amount: 1, showMessage: true })
            }
        });
    }
}

Overgrowth.id = 'overgrowth';

module.exports = Overgrowth;
