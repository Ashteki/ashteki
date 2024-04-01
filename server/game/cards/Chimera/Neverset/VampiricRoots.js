const AspectCard = require('../../../solo/AspectCard');

class VampiricRoots extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            gameAction: ability.actions.removeDamage((context) => ({
                target: context.player.phoenixborn,
                amount: this.getAbilityNumeric(2)
            }))
        });
    }
}

VampiricRoots.id = 'vampiric-roots';

module.exports = VampiricRoots;
