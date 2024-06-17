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
                        trueGameAction: ability.actions.orderedAoE((context) => ({
                            target: [context.targets.theirs, context.targets.myUnit],
                            gameAction: ability.actions.dealDamage({
                                showMessage: true
                            }),
                            promptTitle: "Fork Lightning"
                        }))
                    })
                }
            }
        });
    }
}

ForkLightning.id = 'fork-lightning';

module.exports = ForkLightning;
