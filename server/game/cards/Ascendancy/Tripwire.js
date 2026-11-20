const { BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Tripwire extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Tripwire',
            when: {
                // opponent declares attackers
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            target: {
                activePromptTitle: 'Choose an Artifice die on a card to exhaust',
                showCancel: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Artifice && die.parent,
                gameAction: ability.actions.exhaustDie()
            },
            then: {
                target: {
                    optional: true,
                    cardCondition: (card) => card.isAttacker,
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            }
        });
    }
}

Tripwire.id = 'tripwire';

module.exports = Tripwire;
