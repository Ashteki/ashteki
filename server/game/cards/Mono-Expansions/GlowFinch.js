const Card = require('../../Card.js');

class GlowFinch extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        this.destroyed({
            title: 'Last Request 2',
            may: 'force your opponent to discard the top 2 cards of their deck',
            gameAction: ability.actions.discardTopOfDeck({ amount: 2 })
        });
    }
}

GlowFinch.id = 'glow-finch';

module.exports = GlowFinch;
