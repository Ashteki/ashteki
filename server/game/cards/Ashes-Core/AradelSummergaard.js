const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class AradelSummergaard extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Water Blast',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Natural)])
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
