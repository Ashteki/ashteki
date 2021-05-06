const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonTurtleGuard extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Turtle Guard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'turtle-guard',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.focus > 0 &&
                    (!context.preThenEvent || context.preThenEvent.unable),
                targets: {
                    first: {
                        activePromptTitle: 'Choose an unexhausted Turtle Guard',
                        controller: 'self',
                        cardType: BattlefieldTypes,
                        optional: true,
                        cardCondition: (card) => card.id === 'turtle-guard' && !card.exhausted
                    },
                    second: {
                        activePromptTitle: "Choose an opponent's unexhausted unit",
                        dependsOn: 'first',
                        controller: 'opponent',
                        cardType: BattlefieldTypes,
                        cardCondition: (card) => !card.exhausted
                    }
                },
                then: (context) => ({
                    alwaysTriggers: true,
                    gameAction: ability.actions.sequential([
                        ability.actions.exhaust({
                            target: context.targets.first
                        }),
                        ability.actions.exhaust({
                            target: context.targets.second
                        })
                    ])
                })
            }
        });
    }
}

SummonTurtleGuard.id = 'summon-turtle-guard';

module.exports = SummonTurtleGuard;
