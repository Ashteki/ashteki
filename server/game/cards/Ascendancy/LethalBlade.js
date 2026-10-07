const Card = require('../../Card.js');

class LethalBlade extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) =>
                context.game.attackState &&
                context.game.attackState.isPBAttack &&
                context.game.attackState.attackers.includes(context.source.parent) &&
                !context.source.exhausted,
            effect: ability.effects.modifyAttack(this.getAbilityNumeric(2))
        });
    }
}

LethalBlade.id = 'lethal-blade';

module.exports = LethalBlade;
