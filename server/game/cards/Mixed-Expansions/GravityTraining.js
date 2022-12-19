const { BattlefieldTypes, CardType, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class GravityTraining extends Card {
    setupCardAbilities(ability) {
        this.action({
            getWarnings: (context) => {
                if (!context.player.unitsInPlay.some((u) => u.exhausted)) {
                    return 'You don\'t have any exhausted units'
                }
            },
            title: 'Gravity Training',
            cost: [
                ability.costs.chosenAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    [
                        // parallel cost
                        new DiceCount(1, Level.Class, Magic.Sympathy),
                        new DiceCount(1, Level.Class, Magic.Divine)
                    ]
                ])
            ],
            target: {
                showCancel: true,
                cardType: BattlefieldTypes,
                controller: 'self',
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'enhanced-strength'
                })
            }
        });
    }
}

GravityTraining.id = 'gravity-training';

module.exports = GravityTraining;
