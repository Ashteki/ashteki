const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class PteraHatchling extends Card {
    setupCardAbilities(ability) {
        return this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        context.source.attack > context.source.printedAttack &&
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            target: {
                optional: true,
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Shock 1: choose a unit to deal 1 damage to',
                waitingPromptTitle: 'Shock 1: waiting for opponent',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage(() => ({
                    amount: this.getAbilityNumeric(1),
                    showMessage: true
                }))
            }
        });
    }
}

PteraHatchling.id = 'ptera-hatchling';

module.exports = PteraHatchling;
