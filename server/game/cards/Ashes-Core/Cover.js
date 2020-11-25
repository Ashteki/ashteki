const Card = require('../../Card.js');

class Cover extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    event.context.player === context.player.opponent &&
                    event.card === context.player.phoenixborn &&
                    event.fightEvent.battle.guard === context.player.phoenixborn
            },
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true
            })),
            then: (context) => ({
                gameAction: ability.actions.dealDamage({
                    target: context.event.damageSource,
                    amount: 1
                })
            })
        });
    }
}

Cover.id = 'cover';

module.exports = Cover;
