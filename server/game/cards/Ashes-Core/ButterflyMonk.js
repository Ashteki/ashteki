const Card = require('../../Card.js');

class ButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canGuard()
        });

        this.destroyed({
            gameAction: ability.actions.removeDamage(() => ({
                promptForSelect: {
                    optional: true,
                    cardCondition: (card, context) => card !== context.source,
                    activePromptTitle: 'Mend 1',
                    cardType: ['Ally', 'Conjuration', 'Phoenixborn']
                }
            }))
        });
    }
}

ButterflyMonk.id = 'butterfly-monk';

module.exports = ButterflyMonk;
