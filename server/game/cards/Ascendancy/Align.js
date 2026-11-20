const Card = require('../../Card.js');

class Align extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            location: 'spellboard',
            gameAction: ability.actions.draw()
        });

        this.action({
            title: 'Align',
            cost: [ability.costs.sideAction(), ability.costs.exhaust(), ability.costs.lowerDice(1)],
            location: 'spellboard',
            gameAction: ability.actions.draw()
        });
    }
}

Align.id = 'align';

module.exports = Align;
