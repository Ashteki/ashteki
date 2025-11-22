const Card = require('../../Card.js');

class Barrier extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    event.card.isCharged && event.card.controller === context.player
            },
            effect: 'prevent up to 3 damage',
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 3
            }))
        });
    }
}

Barrier.id = 'barrier';

module.exports = Barrier;
