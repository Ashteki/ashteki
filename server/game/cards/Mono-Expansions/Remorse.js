const Card = require('../../Card.js');

class Remorse extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            // effect: 'force {0} to discard 2 cards from the top of their deck',
            gameAction: ability.actions.discardTopOfDeck({ amount: 2 }),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.opponent.deck.length === 0,
                target: {
                    autoTarget: (context) => context.player.opponent.phoenixborn,
                    gameAction: ability.actions.dealDamage({
                        amount: 2,
                        showMessage: true
                    })
                }
            }
        });
    }
}

Remorse.id = 'remorse';

module.exports = Remorse;
