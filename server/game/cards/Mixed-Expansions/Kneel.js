const Card = require('../../Card.js');

class Kneel extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Kneel',
            effect: 'place 1 exhaustion token on each unexhausted unit',
            gameAction: ability.actions.addExhaustionToken((context) => ({
                amount: 1,
                target: context.game.unitsInPlay.filter((u) => !u.exhausted)
            }))
        });
    }
}

Kneel.id = 'kneel';

module.exports = Kneel;
