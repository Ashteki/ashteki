const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RoseFireDancer extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Distract',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            effect: 'place 1 exhaustion tokens on {0}',
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addExhaustionToken()
            }
        });
    }
}

RoseFireDancer.id = 'rose-fire-dancer';

module.exports = RoseFireDancer;
