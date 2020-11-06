const Card = require('../../Card.js');

class SleightOfHand extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'draw 3 cards',
            gameAction: ability.actions.draw({ amount: 3 })
        });
    }
}

SleightOfHand.id = 'sleight-of-hand';

module.exports = SleightOfHand;
