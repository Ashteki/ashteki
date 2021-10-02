const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RinNorthfell extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ice Buff',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'ice-buff'
                })
            }
        });
    }
}

RinNorthfell.id = 'rin-northfell';

module.exports = RinNorthfell;
