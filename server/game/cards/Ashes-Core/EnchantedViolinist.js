const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EnchantedViolinist extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Song of Sorrow',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                condition: (context) => context.preThenEvent.destroyEvent,
                gameAction: ability.actions.discardTopOfDeck()
            }
        });
    }
}

EnchantedViolinist.id = 'enchanted-violinist';

module.exports = EnchantedViolinist;
