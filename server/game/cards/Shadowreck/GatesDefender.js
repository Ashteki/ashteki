const Card = require('../../Card.js');

class GatesDefender extends Card {
    setupCardAbilities(ability) {
        this.alert();

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
            })),
            preferActionPromptMessage: true
        });
    }
}

GatesDefender.id = 'gates-defender';

module.exports = GatesDefender;
