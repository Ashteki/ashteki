const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BlueJaguar extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event) => event.card === this
            },
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'opponent',
                condition: (card) => BattlefieldTypes.includes(card.type),
                effect: ability.effects.cardCannot('guard')
            })
        });
    }
}

BlueJaguar.id = 'blue-jaguar';

module.exports = BlueJaguar;
