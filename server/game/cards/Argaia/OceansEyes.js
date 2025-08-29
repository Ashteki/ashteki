const { CardType, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class OceansEyes extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose a wounded unit to deal 1 damage to',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.damage > 0,
                gameAction: ability.actions.dealDamage({
                    amount: 1
                })
            }
        });
    }
}

OceansEyes.id = 'oceans-eyes';

module.exports = OceansEyes;
