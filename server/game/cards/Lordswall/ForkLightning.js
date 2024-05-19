const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ForkLightning extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myUnit: {
                    optional: true,
                    activePromptTitle: "Choose an opponent's unit",
                    cardType: BattlefieldTypes,
                    controller: 'opponent'
                },
                theirs: {
                    dependsOn: 'myUnit',
                    optional: true,
                    activePromptTitle: "Choose another opponent's unit",
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    cardCondition: (card, context) => card != context.targets.myUnit,
                    gameAction: ability.actions.conditional({
                        condition: (context) => context.targets.theirs,
                        trueGameAction: [
                            ability.actions.dealDamage((context) => ({
                                target: context.targets.theirs,
                                amount: 1
                            })),
                            ability.actions.dealDamage((context) => ({
                                target: context.targets.myUnit,
                                amount: 1,
                                showMessage: true
                            }))
                        ]
                    })
                }
            }
        });
    }
}

ForkLightning.id = 'fork-lightning';

module.exports = ForkLightning;
