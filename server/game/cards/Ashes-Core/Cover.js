const Card = require('../../Card.js');

class Cover extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.player === context.player && context.source == this
            },
            gameAction: [
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true
                })),
                ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.event.card
                }))
            ]
        });
    }
}

Cover.id = 'cover';

module.exports = Cover;
