const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SeedsOfAggression extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myUnit: {
                    activePromptTitle: 'Choose a unit',
                    cardType: BattlefieldTypes,
                    controller: 'self'
                },
                theirs: {
                    dependsOn: 'myUnit',
                    activePromptTitle: "Choose an opponent's unit",
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: [
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.theirs,
                            amount: context.targets.myUnit.attack,
                            sourceType: 'unit',
                            damageSource: context.targets.myUnit
                        })),
                        ability.actions.dealDamage((context) => ({
                            target: context.targets.myUnit,
                            amount: context.targets.theirs.attack,
                            showMessage: true,
                            sourceType: 'unit',
                            damageSource: context.targets.theirs
                        }))
                    ]
                }
            }
        });
    }
}

SeedsOfAggression.id = 'seeds-of-aggression';

module.exports = SeedsOfAggression;
