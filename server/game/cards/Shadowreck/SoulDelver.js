const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class SoulDelver extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackers.includes(context.source);
                }
            },
            // target: {
            //     targetsPlayer: true,
            //     toSelect: 'die',
            //     mode: 'upTo',
            //     dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
            //     owner: 'opponent',
            //     gameAction: ability.actions.changeDice((context) => ({
            //         numDice: context.player.phoenixborn.status

            //     }))
            // }
            target: {
                toSelect: 'player',
                activePromptTitle: "Choose which player's dice pool to affect",
                gameAction: ability.actions.changeDice((context) => ({
                    owner: context.target === context.player ? 'self' : 'opponent',
                    singleLevel: true
                }))
            }
        });
    }
}

SoulDelver.id = 'soul-delver';

module.exports = SoulDelver;
