const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Gilder extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        this.destroyed({
            inexhaustible: true,
            target: {
                optional: true,
                controller: 'self',
                activePromptTitle: 'Inheritance 1',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

Gilder.id = 'gilder';

module.exports = Gilder;
