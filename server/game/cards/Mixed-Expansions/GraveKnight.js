const Card = require('../../Card.js');

class GraveKnight extends Card {
    setupCardAbilities(ability) {
        // overkill 1
        this.afterDestroysFighting({
            autoResolve: true,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.player.opponent.phoenixborn
            }))
        });

        this.persistentEffect({
            effect: ability.effects.threatening()
        });
    }
}

GraveKnight.id = 'grave-knight';

module.exports = GraveKnight;
