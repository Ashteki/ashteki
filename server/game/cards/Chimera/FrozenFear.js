const AspectCard = require("../../solo/AspectCard");

class FrozenFear extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 1 })
        });

        this.afterDestroysFighting({
            autoResolve: true,
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.addExhaustionToken({ showMessage: true })
            }
        });
    }

}

FrozenFear.id = 'frozen-fear';

module.exports = FrozenFear