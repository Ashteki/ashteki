const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Crescendo extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // opponent declares attackers
                    return event.attackingPlayer === context.source.owner; // my attack
                }
            },
            targets: {
                myUnit: {
                    optional: true,
                    cardCondition: (card) => card.isAttacker,
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                },
                damageUnit: {
                    dependsOn: 'myUnit',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                }
            }
        });
    }
}

Crescendo.id = 'crescendo';

module.exports = Crescendo;
