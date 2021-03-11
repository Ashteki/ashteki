const Card = require('../../Card.js');

class RaptorHatchling extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.owner && event.battles.length >= 3
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this,
                effect: ability.effects.modifyAttack(2),
                duration: 'untilEndOfTurn'
            })),
            effect: 'increase its attack value by 2'
        });
    }
}

RaptorHatchling.id = 'raptor-hatchling';

module.exports = RaptorHatchling;
