const AspectCard = require("../../../solo/AspectCard");

class Devour extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            gameAction: ability.actions.discardTopOfDeck((context) => ({
                amount: context.player.phoenixborn.phase
            }))
        });
    }

}

Devour.id = 'devour';

module.exports = Devour;
