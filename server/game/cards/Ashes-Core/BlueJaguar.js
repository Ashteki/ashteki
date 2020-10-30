const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BlueJaguar extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                optional: true,
                gameAction: ability.actions.cardLastingEffect({
                    cardCondition: (card, context) => card !== context.source,
                    cardType: [...BattlefieldTypes],
                    controller: 'opponent',
                    effect: ability.effects.cardCannot('guard')
                })
            }
        });
    }
}

BlueJaguar.id = 'blue-jaguar';

module.exports = BlueJaguar;
