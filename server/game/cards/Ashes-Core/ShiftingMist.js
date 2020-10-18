const Card = require('../../Card.js');

class ShiftingMist extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shifting Mist',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                toSelect: 'die',
                mode: 'upTo',
                numDice: 2,
                owner: 'self',
                gameAction: ability.actions.setDieLevel({ level: 'power' })
            }
        });
    }
}

ShiftingMist.id = 'shifting-mist';

module.exports = ShiftingMist;
