const { BattlefieldTypes, CardType, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class LuluFirststone extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bolster',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            targets: {
                unit: {
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: ability.actions.addStatusToken()
                },
                conj: {
                    dependsOn: 'unit',
                    controller: 'self',
                    cardType: CardType.ConjuredAlteration,
                    cardCondition: (card) => card.id === 'spark',
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

LuluFirststone.id = 'lulu-firststone';

module.exports = LuluFirststone;
