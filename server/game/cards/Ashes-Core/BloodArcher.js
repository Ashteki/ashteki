const Card = require('../../Card.js');

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
                    activePromptTitle: 'Blood Shot',
                    cardType: ['Ally', 'Conjuration'],
                    gameAction: ability.actions.dealDamage({ showMessage: true })
                }
            }
        });
    }
}

BloodArcher.id = 'blood-archer';

module.exports = BloodArcher;
