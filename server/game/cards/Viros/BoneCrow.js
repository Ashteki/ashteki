const Card = require('../../Card.js');

class BoneCrow extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Feast 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            gameAction: ability.actions.conditional({
                condition: (context) => {
                    const target = context.game.attackState.target;
                    return target.damage;
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
