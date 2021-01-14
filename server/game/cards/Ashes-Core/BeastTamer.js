const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BeastTamer extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.source.isAttacker || context.source.isDefender,
            match: (card, context) =>
                BattlefieldTypes.includes(card.type) && // unit
                (card.isAttacker || card.isDefender) &&
                this.areBattling(card, context.source, context),
            effect: ability.effects.modifyAttack(-1)
        });
    }

    areBattling(card, source, context) {
        return (
            context.game.attackState &&
            context.game.attackState.battles.some(
                (b) =>
                    (b.attacker === card && (b.target === source || b.guard === source)) ||
                    (b.attacker === source && (b.target === card || b.guard === card))
            )
        );
    }
}

BeastTamer.id = 'beast-tamer';

module.exports = BeastTamer;
