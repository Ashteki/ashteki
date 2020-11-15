const Card = require('../../Card.js');

class IronRhino extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 1 })
        });

        this.forcedReaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.damageEvent &&
                    event.damageEvent.fightEvent &&
                    event.damageEvent.damageSource === context.source &&
                    event.damageEvent.fightEvent.attacker === context.source
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.player.opponent.phoenixborn
            }))
        });
    }
}

IronRhino.id = 'iron-rhino';

module.exports = IronRhino;
