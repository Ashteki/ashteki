const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FinalCry extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.controller == context.player && // it's mine
                    BattlefieldTypes.includes(event.card.type) // it's a unit
            },
            effect: "deal 2 damage to opponent's phoenixborn",
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            }
        });
    }
}

FinalCry.id = 'final-cry';

module.exports = FinalCry;
