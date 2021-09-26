const Card = require('../../Card.js');

class ShiftingMist extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shifting Mist',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.changeDice({
                numDice: 2,
                owner: 'self'
            })
        });
    }
}

ShiftingMist.id = 'shifting-mist';

module.exports = ShiftingMist;
