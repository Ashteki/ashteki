const Card = require('../../Card.js');

class ExpandEnergy extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'draw until 2 cards in hand',
            target: {
                gameAction: ability.actions.draw((context) => ({
                    amount: Math.max(2 - context.player.hand.length, 0)
                }))
            }
        });
    }
}

ExpandEnergy.id = 'expand-energy';

module.exports = ExpandEnergy;
