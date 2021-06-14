const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const { capitalize } = require('../../../util.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SmallSacrifice extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.cardsInPlay.length > 0,
            title: 'Small Sacrifice',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            location: 'spellboard',
            targets: {
                first: {
                    activePromptTitle: 'Choose one of your units',
                    controller: 'self',
                    cardType: BattlefieldTypes
                },
                second: {
                    activePromptTitle: "Choose an opponent's unit",
                    dependsOn: 'first',
                    controller: 'opponent',
                    cardType: BattlefieldTypes
                },
                tokenChoice: {
                    dependsOn: 'second',
                    mode: 'options',
                    activePromptTitle: 'Choose an action',
                    options: (context) => this.getSacrificeOptions(context.targets),
                    handler: (option) => (this.chosenType = option.value)
                }
            },
            then: (context) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: () => this.chosenType === 'exhaust',
                    trueGameAction: ability.actions.sequential([
                        ability.actions.exhaust({
                            target: context.targets.first
                        }),
                        ability.actions.exhaust({
                            target: context.targets.second
                        })
                    ]),
                    falseGameAction: ability.actions.sequential([
                        ability.actions.dealDamage({
                            target: context.targets.first
                        }),
                        ability.actions.dealDamage({
                            target: context.targets.second
                        })
                    ])
                })
            })
        });
    }

    getSacrificeOptions(targets) {
        let choices = ['damage'];

        if (this.focus && ![targets.first, targets.second].some((t) => t.exhausted)) {
            choices.push('exhaust');
        }
        return choices.map((t) => ({ name: capitalize(t), value: t }));
    }
}

SmallSacrifice.id = 'small-sacrifice';

module.exports = SmallSacrifice;
