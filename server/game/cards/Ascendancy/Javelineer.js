const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Javelineer extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Frost Throw',
            cost: [ability.costs.mainAction()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.attack
                }))
            }
        });
    }
}

Javelineer.id = 'javelineer';

module.exports = Javelineer;
