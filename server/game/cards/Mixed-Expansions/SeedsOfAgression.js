const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SeedsOfAggression extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myUnit: {
                    activePromptTitle: 'Choose a Unit',
                    cardType: BattlefieldTypes,
                    controller: 'self'
                },
                theirs: {
                    dependsOn: 'myUnit',
                    activePromptTitle: "Choose an opponent's Unit",
                    cardType: BattlefieldTypes,
                    gameAction: [
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.theirs,
                            amount: context.targets.myUnit.attack
                        })),
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.myUnit,
                            amount: context.targets.theirs.attack
                        }))
                    ]
                }
            }
        });
    }
}

SeedsOfAggression.id = 'blood-chains';

module.exports = SeedsOfAggression;
