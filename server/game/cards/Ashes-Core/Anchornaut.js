const Card = require('../../Card.js');

class Anchornaut extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a target unit',
            target: {
                optional: true,
                activePromptTitle: 'Throw 1',
                cardType: ['Ally', 'Conjuration'],
                gameAction: ability.actions.dealDamage({
                    amount: 1
                })
            }
        });
    }
}

Anchornaut.id = 'anchornaut';

module.exports = Anchornaut;
