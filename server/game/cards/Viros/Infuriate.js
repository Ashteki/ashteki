const Card = require('../../Card.js');

class Infuriate extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.battles.some((b) => b.attacker === context.source.parent)
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.source.parent,
                amount: this.getAbilityNumeric(2)
            }))
        });

        this.whileAttached({
            effect: ability.effects.modifyAttack(() => this.getAbilityNumeric(this.parent.damage))
        })
    }
}

Infuriate.id = 'infuriate';

module.exports = Infuriate;
