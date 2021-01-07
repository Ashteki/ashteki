const Card = require('../../Card.js');

class GlowFinch extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canGuard()
        });

        this.destroyed({
            may: 'Last Request 2',
            gameAction: ability.actions.discardTopOfDeck({ amount: 2 })
        });
    }
}

GlowFinch.id = 'glow-finch';

module.exports = GlowFinch;
