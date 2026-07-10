const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class OceansEyes extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose a wounded unit to deal 1 damage to',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.damage > 0,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: this.getAbilityNumeric(1)
                }))
            }
        });
    }
}

OceansEyes.id = 'oceans-eye';

module.exports = OceansEyes;
