const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SunSister extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Care 1',
            cost: [ability.costs.sideAction()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.removeDamage()
            }
        });
    }
}

SunSister.id = 'sun-sister';

module.exports = SunSister;
