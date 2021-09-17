const Card = require('../../Card.js');

class Cover extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    event.context.player === context.player.opponent &&
                    event.card === context.player.phoenixborn &&
                    event.fightEvent &&
                    event.fightEvent.battle.guard === context.player.phoenixborn
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 'all'
            })),
            then: (context) => ({
                gameAction: ability.actions.dealDamage({
                    target: context.event.damageSource,
                    amount: 1,
                    showMessage: true
                })
            })
        });
    }
}

Cover.id = 'cover';

module.exports = Cover;
