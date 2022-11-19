const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Disengage extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDefendersDeclared: (event, context) =>
                    // not for unit attacks
                    event.attack.isPBAttack &&
                    // when opponent declares blockers
                    event.attack.attackingPlayer === context.source.owner &&
                    event.attack.battles.some(
                        // a blocked ally
                        (battle) => battle.attacker.type === CardType.Ally && battle.guard
                    )
            },
            target: {
                controller: 'self',
                cardType: [CardType.Ally],
                cardCondition: (card, context) => context.game.attackState.battles.some(
                    // a blocked ally
                    (battle) => battle.attacker === card && battle.guard
                ),
                gameAction: ability.actions.removeAttacker()
            },
            then: {
                target: {
                    autoTarget: (context) => context.preThenEvent.context.defender,
                    gameAction: ability.actions.exhaust()
                }
            }
        });
    }
}

Disengage.id = 'disengage';

module.exports = Disengage;
