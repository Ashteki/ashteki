const Card = require('../../Card.js');

class RallyTheTroops extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Rally the Troops',
            target: {
                mode: 'unlimited',
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.returnToHand()
            },
            then: (context) => ({
                gameAction: ability.actions.removeDamage({
                    target: context.player.phoenixborn,
                    amount: context.target.length
                })
            }),
            effect: 'return {1} exhausted allies to hand and heal {1} wounds from {2}',
            effectArgs: (context) => [context.target.length, context.player.phoenixborn]
        });
    }
}

RallyTheTroops.id = 'rally-the-troops';

module.exports = RallyTheTroops;
