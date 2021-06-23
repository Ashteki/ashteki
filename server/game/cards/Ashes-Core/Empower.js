const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Empower extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Empower',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    [
                        // parallel cost
                        new DiceCount(1, Level.Class, Magic.Sympathy),
                        new DiceCount(1, Level.Class, Magic.Natural)
                    ]
                ])
            ],
            target: {
                controller: 'self',
                activePromptTitle: 'Choose a unit to empower',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addStatusToken()
            },
            then: {
                condition: (context) => context.source.focus,
                targets: {
                    tokenBoy: {
                        optional: true,
                        controller: 'self',
                        activePromptTitle: 'Choose a unit with status tokens',
                        cardType: BattlefieldTypes,
                        cardCondition: (card) => card.tokens.status
                    },
                    amount: {
                        dependsOn: 'tokenBoy',
                        activePromptTitle: 'how many tokens?',
                        mode: 'options',
                        options: (context) =>
                            context.targets.tokenBoy &&
                            this.getValueOptions(context.targets.tokenBoy.tokens.status),
                        handler: (option) => (this.chosenValue = option.value)
                    }
                },
                then: (preThenContext) => ({
                    alwaysTriggers: true,
                    condition: () => this.chosenValue > 0,
                    gameAction: ability.actions.removeStatus(() => ({
                        target: preThenContext.targets.tokenBoy,
                        amount: this.chosenValue
                    })),
                    then: {
                        target: {
                            activePromptTitle: 'Choose a unit to damage',
                            cardType: BattlefieldTypes,

                            gameAction: ability.actions.dealDamage(() => ({
                                amount: this.chosenValue
                            }))
                        }
                    }
                })
            }
        });
    }

    getValueOptions(maxValue) {
        let values = [];
        for (let i = 0; i <= maxValue; i++) {
            values.push({ name: '' + i, value: i });
        }
        return values;
    }
}

Empower.id = 'empower';

module.exports = Empower;
