const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BloodChains extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myUnit: {
                    activePromptTitle: 'Destroy a Unit',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                },
                phb: {
                    dependsOn: 'myUnit',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.addExhaustionToken((context) => ({
                        amount: context.targets.myUnit.damage > 0 ? 2 : 1
                    }))
                }
            }
        });
    }
}

BloodChains.id = 'blood-chains';

module.exports = BloodChains;
