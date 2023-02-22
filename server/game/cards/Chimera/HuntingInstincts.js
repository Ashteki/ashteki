const AspectCard = require("../../solo/AspectCard");

class HuntingInstincts extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            gameAction: ability.actions.addRedRainsToken((context) => ({
                target: context.player.phoenixborn,
                amount: 1
            }))
        });
    }

}

HuntingInstincts.id = 'hunting-instincts';

module.exports = HuntingInstincts