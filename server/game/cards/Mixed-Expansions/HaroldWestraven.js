const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class HaroldWestraven extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Mark Prey',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'hunters-mark'
                })
            }
        });
    }
}

HaroldWestraven.id = 'harold-westraven';

module.exports = HaroldWestraven;
