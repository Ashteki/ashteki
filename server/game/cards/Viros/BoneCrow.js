const Card = require('../../Card.js');

class BoneCrow extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Feast 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            gameAction: ability.actions.conditional({
                condition: (context) => {
                    const target = context.game.attackState.getTargetFor(context.source);
                    return target.damage
                },
                trueGameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(this.getAbilityNumeric(1)),
                    target: context.source
                }))
            })
        });
    }
}

BoneCrow.id = 'bone-crow';

module.exports = BoneCrow;
