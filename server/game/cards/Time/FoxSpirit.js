const Card = require('../../Card.js');

class FoxSpirit extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Pounce 2',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some(
                        (b) => b.attacker === context.source && b.target.exhausted
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect({
                duration: 'untilEndOfTurn',
                target: 'self', //target: context.source,
                effect: ability.effects.modifyAttack(2)
            })
        });
    }
}

FoxSpirit.id = 'fox-spirit';

module.exports = FoxSpirit;
