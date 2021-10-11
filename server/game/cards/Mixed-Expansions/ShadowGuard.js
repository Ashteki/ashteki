const Card = require('../../Card.js');

class ShadowGuard extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

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
    }
}

ShadowGuard.id = 'shadow-guard';

module.exports = ShadowGuard;
