const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Gilder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effect.canGuard()
        });

        this.leavesPlay({
            optional: true,
            target: {
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Inheritance 1',
                cardType: [...BattlefieldTypes],
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

Gilder.id = 'gilder';

module.exports = Gilder;
