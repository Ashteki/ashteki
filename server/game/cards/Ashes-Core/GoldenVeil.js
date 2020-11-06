const Card = require('../../Card.js');

class GoldenVeil extends Card {
    // on target my unit with a spell / ability / dice power (not attack) - play to cancel
    // setupCardAbilities(ability) {
    //     this.reaction({
    //         when: {
    //             onCardDestroyed: () => true
    //         },
    //         effect: 'redirect the damage',
    //         gameAction: ability.actions.dealDamage((context) => ({
    //             amount: 1,
    //             target: context.player.opponent.phoenixborn
    //         }))
    //     });
    // }
}

GoldenVeil.id = 'golden-veil';

module.exports = GoldenVeil;
