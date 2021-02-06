const Card = require('../../Card.js');

class ChantOfWorship extends Card {
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
            title: 'Worship Draw',
            location: 'spellboard',
            cost: [ability.costs.mainAction(), ability.costs.exhaust(), ability.costs.loseStatus()],
            gameAction: ability.actions.draw()
        });
    }
}

ChantOfWorship.id = 'chant-of-worship';

module.exports = ChantOfWorship;
