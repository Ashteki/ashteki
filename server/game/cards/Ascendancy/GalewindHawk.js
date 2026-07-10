const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class GalewindHawk extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Galewinds',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                activePromptTitle:
                    'Choose an exhausted natural or astral die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) =>
                    [Magic.Astral, Magic.Natural].includes(die.magic) && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });
    }
}

GalewindHawk.id = 'galewind-hawk';

module.exports = GalewindHawk;
