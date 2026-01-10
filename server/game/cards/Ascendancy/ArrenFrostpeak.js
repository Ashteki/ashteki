const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class ArrenFrostpeak extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ascend',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Astral)])
            ],
            target: {
                showCancel: true,
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Choose a unit to deal 1 damage to',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose an exhausted Astral die to place on Arren',
                    optional: true,
                    toSelect: 'die',
                    owner: 'self',
                    dieCondition: (die) => die.magic === Magic.Astral && die.exhausted,
                    gameAction: ability.actions.resolveDieAbility((context) => ({
                        targetCard: context.source
                    }))
                }
            }
        });
    }
}

ArrenFrostpeak.id = 'arren-frostpeak';

module.exports = ArrenFrostpeak;
