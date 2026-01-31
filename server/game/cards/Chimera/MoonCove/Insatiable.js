const AspectCard = require('../../../solo/AspectCard');

class Insatiable extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.activeNonPowerDice.slice(0, context.player.chimeraPhase),
                gameAction: ability.actions.raiseDie()
            }
        });
    }
}

Insatiable.id = 'insatiable';

module.exports = Insatiable;
