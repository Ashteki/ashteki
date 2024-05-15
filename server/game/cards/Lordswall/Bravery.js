const Card = require('../../Card.js');

class Bravery extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) => event.card.controller === context.player
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            }))
        });
    }
}

Bravery.id = 'bravery';

module.exports = Bravery;
