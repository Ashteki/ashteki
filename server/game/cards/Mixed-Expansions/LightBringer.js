const Card = require('../../Card.js');

class LightBringer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.untilNextTurn({
                targetController: 'opponent',
                effect: ability.effects.playerCannot(
                    'spendMain',
                    (context) => context.player.unitsInPlay.length > 0
                )
            })
        });
    }
}

LightBringer.id = 'light-bringer';

module.exports = LightBringer;
