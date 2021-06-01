const { Level, BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonTurtleGuard extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Turtle Guard',
            cost: this.getTurtleCost(ability),
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'turtle-guard'
            }),
            then: () => ({
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.focus > 0 &&
                    (!context.preThenEvent.childEvent ||
                        (context.preThenEvent.childEvent.name === 'onCardEntersPlay' &&
                            context.preThenEvent.childEvent.cancelled)),
                targets: this.getTurtleTargets(),
                then: this.getTurtleThen(ability)
            })
        });

        this.action({
            condition: (context) => context.source.focus,
            title: 'Focus Without Summon',
            cost: this.getTurtleCost(ability),
            location: 'spellboard',

            targets: this.getTurtleTargets(),
            then: this.getTurtleThen(ability)
        });
    }

    getTurtleCost(ability) {
        return [
            ability.costs.mainAction(),
            ability.costs.sideAction(),
            ability.costs.exhaust(),
            ability.costs.dice([new DiceCount(1, Level.Power, Magic.Time)])
        ]
    }

    getTurtleTargets() {
        return {
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
        };
    }

    getTurtleThen(ability) {
        return (context) => ({
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
}

SummonTurtleGuard.id = 'summon-turtle-guard';

module.exports = SummonTurtleGuard;
