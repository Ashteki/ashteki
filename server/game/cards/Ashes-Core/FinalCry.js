const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FinalCry extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.controller == context.player && // it's mine
                    BattlefieldTypes.includes(event.card.type) // it's a unit
            },
            effect: 'deal 2 damage to oppponents phoenixborn',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.player.opponent.phoenixborn
            }))
        });
    }
}

FinalCry.id = 'final-cry';

module.exports = FinalCry;
