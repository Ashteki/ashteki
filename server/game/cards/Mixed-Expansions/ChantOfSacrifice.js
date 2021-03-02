const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChantOfSacrifice extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ChantOfSacrifice.id = 'chant-of-sacrifice';

module.exports = ChantOfSacrifice;
