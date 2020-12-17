const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SteadyGaze extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'place 2 exhaustion tokens on a target unit',
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addExhaustionToken({ amount: 2 })
            }
        });
    }
}

SteadyGaze.id = 'steady-gaze';

module.exports = SteadyGaze;
