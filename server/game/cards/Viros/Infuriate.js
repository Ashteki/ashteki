const Card = require('../../Card.js');

class Infuriate extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackers.includes(context.source.parent)
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.source.parent,
                amount: this.getAbilityNumeric(2)
            }))
        });

        this.whileAttached({
            effect: ability.effects.modifyAttack(() => this.getAbilityNumeric(this.parent.damage))
        });
    }
}

Infuriate.id = 'infuriate';

module.exports = Infuriate;
