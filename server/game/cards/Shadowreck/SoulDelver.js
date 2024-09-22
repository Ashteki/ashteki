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
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: (context) => context.player.phoenixborn.status,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            }
        });
    }
}

SoulDelver.id = 'soul-delver';

module.exports = SoulDelver;
