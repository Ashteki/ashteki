const Card = require('../../Card.js');

class ButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        this.destroyed({
            target: {
                controller: 'self',
                optional: true,
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Mend 1',
                cardType: ['Ally', 'Conjuration', 'Phoenixborn'],
                gameAction: ability.actions.removeDamage()
            }
        });
    }
}

ButterflyMonk.id = 'butterfly-monk';

module.exports = ButterflyMonk;
