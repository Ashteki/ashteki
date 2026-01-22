const AspectCard = require('../../../solo/AspectCard');

class Capsize extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            effect: 'lower all opponents active dice one level',
            target: {
                toSelect: 'die',
                autoTarget: (context) => context.player.opponent.activeNonBasicDice,
                gameAction: ability.actions.lowerDie()
            }
        });
    }
}

Capsize.id = 'capsize';

module.exports = Capsize;
