const Card = require('../../Card.js');

class AradelSummergaard extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Water Blast',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'natural', level: 'class' }])
            ],
            target: {
                cardType: ['Ally', 'Conjuration'],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

AradelSummergaard.id = 'aradel-summergaard';

module.exports = AradelSummergaard;
