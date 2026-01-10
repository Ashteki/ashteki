const Card = require('../../Card.js');

class Recharge extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a charged card to remove exhaustion and 2 damage from',
                showCancel: true,
                cardCondition: (card) => card.isCharged,
                gameAction: [
                    ability.actions.removeExhaustion(),
                    ability.actions.removeDamage({ amount: 2 })
                ]
            }
        });
    }
}

Recharge.id = 'recharge';

module.exports = Recharge;
