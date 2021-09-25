const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BloodChains extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Destroy a Unit',
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.addExhaustionToken((context) => ({
                        amount: context.preThenEvent.clone.damage > 0 ? 2 : 1,
                        showMessage: true
                    }))
                }
            }
        });
    }
}

BloodChains.id = 'blood-chains';

module.exports = BloodChains;
