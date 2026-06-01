const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FreezingRain extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: BattlefieldTypes,
                cardCondition: (card, context) =>
                    card.exhausted &&
                    // bot rules for play - don't exhaust own units
                    (!context.player.isBot || card.controller === context.player.opponent),
                gameAction: ability.actions.addExhaustionToken({ amount: 1 })
            }
        });
    }

    get targetPriority() {
        return 'value';
    }
}

FreezingRain.id = 'freezing-rain';

module.exports = FreezingRain;
