const Card = require('../../Card.js');

class ShadowSpirit extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Trickery 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                toSelect: 'die',
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            }
        });
    }
}

ShadowSpirit.id = 'shadow-spirit';

module.exports = ShadowSpirit;
