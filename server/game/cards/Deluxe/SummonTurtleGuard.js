const { Level, BattlefieldTypes, Magic } = require('../../../constants.js');
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
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Time)])
            ],
            location: 'spellboard',
            may: 'summon a Turtle Guard',
            skipMay: (context) =>
                !context.player.hasCardInArchives('turtle-guard') ||
                context.player.isBattlefieldFull(),
            gameAction: ability.actions.summon({
                conjuration: 'turtle-guard'
            }),
            then: () => ({
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.focus > 0 &&
                    !(context.preThenEvent?.context.summoned?.length > 0),
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
                            target: context.targets.first,
                            showMessage: true
                        }),
                        ability.actions.exhaust({
                            target: context.targets.second,
                            showMessage: true
                        })
                    ])
                })
            })
        });
    }
}

SummonTurtleGuard.id = 'summon-turtle-guard';

module.exports = SummonTurtleGuard;
