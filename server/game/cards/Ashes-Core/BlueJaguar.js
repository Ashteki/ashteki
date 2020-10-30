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
                cardType: [BattlefieldTypes],
                controller: 'opponent',
                gameAction: ability.actions.forRemainderOfTurn({
                    effect: ability.effects.cardCannot('guard')
                })
            }
        });
    }
}

BlueJaguar.id = 'blue-jaguar';

module.exports = BlueJaguar;
