const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Javelineer extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Frost Throw',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            target: {
                activePromptTitle: (context) => 'Choose a card to deal' + context.source.attack + 'damage to',
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
