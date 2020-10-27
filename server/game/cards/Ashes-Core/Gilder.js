const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Gilder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canGuard()
        });

        this.destroyed({
            gameAction: ability.actions.addStatusToken(() => ({
                promptForSelect: {
                    optional: true,
                    cardCondition: (card, context) => card !== context.source,
                    activePromptTitle: 'Inheritance 1',
                    cardType: [...BattlefieldTypes]
                }
            }))
        });
    }
}

Gilder.id = 'gilder';

module.exports = Gilder;
