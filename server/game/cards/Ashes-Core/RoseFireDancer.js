const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RoseFireDancer extends Card {
    setupCardAbilities(ability) {
        this.action({
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            effect: 'place 1 exhaustion tokens on a target unit',
            target: {
                cardType: [...BattlefieldTypes],
                gameAction: ability.actions.addExhaustionToken()
            }
        });
    }
}

RoseFireDancer.id = 'rose-fire-dancer';

module.exports = RoseFireDancer;
