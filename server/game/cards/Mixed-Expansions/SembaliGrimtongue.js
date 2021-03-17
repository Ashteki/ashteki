const { Level, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const { Costs } = require('../../costs.js');
const DiceCount = require('../../DiceCount.js');

class SembaliGrimtongue extends Card {
    setupCardAbilities(ability) {
        return this.action({
            title: 'Gift of Wings',
            cost: [
                Costs.sideAction(),
                Costs.exhaustDie(),
                ability.costs.dice([new DiceCount(2, Level.Basic)])
            ],
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: [
                    ability.actions.removeExhaustion({ all: true }),
                    ability.actions.cardLastingEffect({
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.preventGuard()
                    })
                ]
            },
            message:
                '{0} uses {1} to remove all exhaustion tokens from {2}. {2} cannot be guarded this turn.',
            messageArgs: (context) => [context.player, context.source, context.target]
        });
    }
}

SembaliGrimtongue.id = 'sembali-grimtongue';

module.exports = SembaliGrimtongue;
