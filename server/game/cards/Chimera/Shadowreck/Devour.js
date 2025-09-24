const AspectCard = require("../../../solo/AspectCard");

class Devour extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            gameAction: ability.actions.discardTopOfDeck((context) => ({
                // target: context.player.opponent,
                damageIfEmpty: true,
                amount: context.player.chimeraPhase
            }))
        });
    }

}

Devour.id = 'devour';

module.exports = Devour;
