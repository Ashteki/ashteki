const Card = require('../../Card.js');

class SoulDelver extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                toSelect: 'player',
                activePromptTitle: "Choose which player's dice pool to affect",
                gameAction: ability.actions.changeDice((context) => ({
                    owner: context.target === context.player ? 'self' : 'opponent',
                    singleLevel: true,
                    numDice: context.player.phoenixborn.status
                }))
            }
        });
    }
}

SoulDelver.id = 'soul-delver';

module.exports = SoulDelver;
