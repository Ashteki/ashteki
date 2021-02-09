const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FluteMage extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Enliven',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'any',
                gameAction: ability.actions.removeExhaustion({ amount: 1 })
            }
        });
    }
}

FluteMage.id = 'flute-mage';

module.exports = FluteMage;
