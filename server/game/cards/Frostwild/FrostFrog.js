const Card = require('../../Card.js');

class FrostFrog extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Cold Snap 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            gameAction: ability.actions.chooseAction((context) => ({
                choices: {
                    '+1 Attack': ability.actions.cardLastingEffect(() => ({
                        target: this,
                        effect: ability.effects.modifyAttack(this.getAbilityNumeric(1)),
                        duration: 'untilEndOfTurn'
                    })),
                    Exhaust: ability.actions.exhaust({
                        promptForSelect: {
                            cardCondition: (card) => card.life <= this.getAbilityNumeric(1),
                            controller: 'opponent'
                        }
                    })
                }
            }))
        });
    }
}

FrostFrog.id = 'frost-frog';

module.exports = FrostFrog;
