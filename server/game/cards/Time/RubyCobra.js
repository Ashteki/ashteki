const Card = require('../../Card.js');

class RubyCobra extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this,
                effect: ability.effects.modifyAttack(this.getAbilityNumeric(1)),
                duration: 'untilEndOfTurn'
            })),
            then: {
                gameAction: ability.actions.discardTopOfDeck(() => ({
                    amount: this.getAbilityNumeric(1)
                }))
            },
            effect: 'increase its attack value by 1'
        });

        this.persistentEffect({
            condition: (context) =>
                !context.source.exhausted &&
                context.game.attackState &&
                context.game.attackState.target === context.source,
            targetController: 'Any',
            match: (card) => card.hasCharmDie,
            effect: ability.effects.cardCannot('attack')
        });
    }
}

RubyCobra.id = 'ruby-cobra';

module.exports = RubyCobra;
