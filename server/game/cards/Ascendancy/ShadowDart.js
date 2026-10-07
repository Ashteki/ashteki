const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShadowDart extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.exhausted,
            effect: [
                ability.effects.cannotBeAttackTarget(),
                ability.effects.preventBlock(
                    (eventContext, context) =>
                        BattlefieldTypes.includes(eventContext.card.type) &&
                        eventContext.card.attack > context.source.attack
                ),
                ability.effects.preventGuard(
                    (eventContext, context) =>
                        BattlefieldTypes.includes(eventContext.card.type) &&
                        eventContext.card.attack > context.source.attack
                )
            ]
        });
    }
}

ShadowDart.id = 'shadow-dart';

module.exports = ShadowDart;