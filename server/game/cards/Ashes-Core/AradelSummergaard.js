const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
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
            effect: 'deal 2 damage to a unit',
            target: {
                activePromptTitle: 'Water Blast',
                cardType: [BattlefieldTypes],
                controller: 'any',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

AradelSummergaard.id = 'aradel-summergaard';

module.exports = AradelSummergaard;
