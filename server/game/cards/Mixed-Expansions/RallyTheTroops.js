const Card = require('../../Card.js');

class RallyTheTroops extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Rally the Troops',
            target: {
                mode: 'unlimited',
                cardCondition: (card) => card.exhausted,
                cardType: 'Ally',
                gameAction: ability.actions.returnToHand()
            },
            then: (context) => ({
                gameAction: ability.actions.removeDamage({
                    target: context.player.phoenixborn,
                    amount: context.target.length,
                    showMessage: true
                })
            })
        });
    }
}

RallyTheTroops.id = 'rally-the-troops';

module.exports = RallyTheTroops;
