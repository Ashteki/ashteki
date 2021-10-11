const Card = require('../../Card.js');

class Stasis extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            isLimited: true,
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            location: 'hand',
            gameAction: ability.actions.playCard(() => ({
                target: this,
                ignoreActionCost: true,
                isLimited: true,
                playedAsReaction: true
            }))
        });

        this.whileAttached({
            effect: ability.effects.exhausted()
        });

        this.action({
            title: 'Unchain',
            cost: [ability.costs.mainAction(), ability.costs.sideAction()],
            gameAction: ability.actions.discard({ target: this })
        });
    }
}

Stasis.id = 'stasis';

module.exports = Stasis;
