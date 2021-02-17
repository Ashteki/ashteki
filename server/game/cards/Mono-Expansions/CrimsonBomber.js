const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class CrimsonBomber extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Detonate 3',
            cost: [ability.costs.sideAction(), ability.costs.destroy()],
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addDamageToken()
            }
        });
    }
}

CrimsonBomber.id = 'crimson-bomber';

module.exports = CrimsonBomber;
