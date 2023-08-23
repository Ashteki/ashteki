const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class IceAdaptation extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyLife(1)]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                optional: true,
                controller: 'opponent',
                activePromptTitle: 'Choose a unit to exhaust',
                cardType: BattlefieldTypes,
                cardCondition: (card) => !card.exhausted && card.attack <= 1,
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

IceAdaptation.id = 'ice-adaptation';

module.exports = IceAdaptation;
