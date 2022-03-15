const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShadowSpirit extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Trickery 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                targetsPlayer: true,
                activePromptTitle: 'Choose a die to lower',
                optional: true,
                toSelect: 'die',
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            }
        });
    }
}

ShadowSpirit.id = 'shadow-spirit';

module.exports = ShadowSpirit;
