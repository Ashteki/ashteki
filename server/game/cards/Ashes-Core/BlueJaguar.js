const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BlueJaguar extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                activePromptTitle: 'choose a unit to prevent block/guard',
                optional: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect({
                    effect: [
                        ability.effects.cardCannot('guard'),
                        ability.effects.cardCannot('block')
                    ],
                    duration: 'untilEndOfTurn'
                })
            }
        });
    }
}

BlueJaguar.id = 'blue-jaguar';

module.exports = BlueJaguar;
