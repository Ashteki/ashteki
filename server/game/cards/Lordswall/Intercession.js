const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Intercession extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Call To Action',
            when: {
                // opponent declares attackers
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            target: {
                activePromptTitle: 'Choose a unit to intercede',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: [ability.effects.canGuard(), ability.effects.alert()]
                })
            }
        });
    }
}

Intercession.id = 'intercession';

module.exports = Intercession;
