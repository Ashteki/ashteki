const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Crescendo extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackingPlayer === context.source.owner; // my attack
                }
            },
            targets: {
                myUnit: {
                    optional: true,
                    activePromptTitle: 'Choose one of your units to receive 1 damage',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                },
                damageUnit: {
                    dependsOn: 'myUnit',
                    cardType: BattlefieldTypes,
                    activePromptTitle: 'Choose a unit to receive 3 damage',
                    gameAction: ability.actions.dealDamage({ amount: 3, showMessage: true })
                }
            }
        });
    }
}

Crescendo.id = 'crescendo';

module.exports = Crescendo;
