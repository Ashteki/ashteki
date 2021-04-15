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
                gameAction: ability.actions.removeExhaustion()
            }
        });
    }
}

CallToAction.id = 'call-to-action';

module.exports = CallToAction;
