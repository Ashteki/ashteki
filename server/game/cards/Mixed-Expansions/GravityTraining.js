const { BattlefieldTypes, CardType, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class GravityTraining extends Card {
    setupCardAbilities(ability) {
        this.action({
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
            targets: {
                unit: {
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    cardCondition: (card) => card.exhausted
                },
                conj: {
                    dependsOn: 'unit',
                    controller: 'self',
                    cardType: CardType.ConjuredAlteration,
                    cardCondition: (card) => card.id === 'enhanced-strength',
                    location: 'archives',
                    gameAction: ability.actions.attach((context) => ({
                        upgrade: context.targets.conj,
                        target: context.targets.unit
                    }))
                }
            }
        });
    }
}

GravityTraining.id = 'gravity-training';

module.exports = GravityTraining;
