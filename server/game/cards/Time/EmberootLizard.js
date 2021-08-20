const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EmberootLizard extends Card {
    setupCardAbilities(ability) {
        return this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker &&
                        context.source.status > 0
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this,
                effect: ability.effects.modifyAttack(1),
                duration: 'untilEndOfTurn'
            })),
            then: {
                target: {
                    optional: true,
                    cardCondition: (card, context) => card !== context.source,
                    activePromptTitle: 'Ignite',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({
                        amount: 1
                    })
                }
            },
            effect: 'increase its attack value by 1'
        });
    }
}

EmberootLizard.id = 'emberoot-lizard';

module.exports = EmberootLizard;
