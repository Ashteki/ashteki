const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class BloodArcher extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Blood Shot',
            cost: [ability.costs.sideAction()],
            gameAction: ability.actions.addDamageToken((context) => ({
                target: context.source
            })),
            then: {
                target: {
                    promptTitle: 'Choose a target unit to receive one damage',
                    location: ['play area', 'discard'],
                    activePromptTitle: 'Blood Shot',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage((context) => ({
                        // set damageSource so that the damage triggers even if archer is in discard
                        damageSource: context.preThenEvent.clone,
                        showMessage: true
                    }))
                }
            }
        });
    }
}

BloodArcher.id = 'blood-archer';

module.exports = BloodArcher;
