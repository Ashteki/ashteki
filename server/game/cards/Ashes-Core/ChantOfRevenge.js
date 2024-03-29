const Card = require('../../Card.js');

class ChantOfRevenge extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            condition: (context) => context.source.status == 0,
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Take revenge',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust(), ability.costs.loseStatus()],
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({
                    amount: 1
                })
            }

        });
    }
}

ChantOfRevenge.id = 'chant-of-revenge';

module.exports = ChantOfRevenge;
