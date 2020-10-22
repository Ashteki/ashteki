const Card = require('../../Card.js');

class ButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.leavesPlay({
            optional: true,
            target: {
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Mend 1',
                cardType: ['Ally', 'Conjuration', 'Phoenixborn'],
                gameAction: ability.actions.removeDamage({ amount: 1 })
            }
        });
    }
}

ButterflyMonk.id = 'butterfly-monk';

module.exports = ButterflyMonk;
