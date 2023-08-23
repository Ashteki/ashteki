const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FireAdaptation extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                optional: true,
                controller: 'opponent',
                activePromptTitle: 'Choose a unit to deal 1 damage to',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

FireAdaptation.id = 'fire-adaptation';

module.exports = FireAdaptation;
