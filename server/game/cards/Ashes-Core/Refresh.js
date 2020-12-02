const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Refresh extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'remove all exhaustion tokens from a target unit',
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.removeExhaustion({ all: true })
            }
        });
    }
}

Refresh.id = 'refresh';

module.exports = Refresh;
