const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const { capitalize } = require('../../../util.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SmallSacrifice extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Small Sacrifice',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            location: 'spellboard',
            targets: {
                first: {
                    player: 'self',
                    cardType: BattlefieldTypes
                },
                second: {
                    dependsOn: 'first',
                    player: 'opponent',
                    cardType: BattlefieldTypes
                },
                tokenChoice: {
                    dependsOn: 'second',
                    mode: 'options',
                    options: (context) => this.getSacrificeOptions(context.targets),
                    handler: (option) => (this.chosenType = option.value)
                }
            },
            then: (context) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: () => this.chosenType === 'exhaust',
                    trueGameAction: ability.actions.exhaust({
                        target: [context.targets.first, context.targets.second]
                    }),
                    falseGameAction: ability.actions.dealDamage({
                        target: [context.targets.first, context.targets.second]
                    })
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
