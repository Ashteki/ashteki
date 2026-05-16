const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SteadyGaze extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'place 2 exhaustion tokens on {1}',
            effectArgs: (context) => context.target,
            target: {
                cardType: BattlefieldTypes,
                cardCondition: (card, context) =>
                    // bot rules for play - don't exhaust own units
                    !context.player.isBot || card.controller === context.player.opponent,
                gameAction: ability.actions.addExhaustionToken({ amount: 2 })
            }
        });
    }

    get targetPriority() {
        return 'value';
    }
}

SteadyGaze.id = 'steady-gaze';

module.exports = SteadyGaze;
