const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class CallToAction extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Call To Action',
            when: {
                // opponent declares attackers
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            target: {
                activePromptTitle: 'Choose a unit to remove exhaustion',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.exhausted,
                controller: 'self',
                // Assumption: normally the player would want to remove an exhaustion token in preference to a gravityFlux exhaustion token
                gameAction: ability.actions.removeToken((context) => ({
                    type: context.target.hasToken('exhaustion') ? 'exhaustion' :
                    context.target.hasToken('gravityFlux') ? 'gravityFlux': 'exhaustion'
                }))
            }
        });
    }
}

CallToAction.id = 'call-to-action';

module.exports = CallToAction;
