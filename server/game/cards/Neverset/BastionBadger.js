const Card = require('../../Card.js');

class BastionBadger extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();


        this.persistentEffect({
            condition: (context) =>
                context.game.attackState &&
                context.game.attackState.involvesCard(context.source) &&
                context.game.attackState.getBattleOpponent(context.source)?.hasCharmDie &&
                !context.source.exhausted,
            effect: ability.effects.modifyAttack(this.getAbilityNumeric(2))
        });
    }
}

BastionBadger.id = 'bastion-badger';

module.exports = BastionBadger;
