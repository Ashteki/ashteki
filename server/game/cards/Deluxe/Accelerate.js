const Card = require('../../Card.js');

class Accelerate extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Accelerate',
            effect: 'draw a card, fix 2 dice, and gain 2 side actions',
            gameAction: [
                ability.actions.draw(),
                ability.actions.changeDice({
                    numDice: 2,
                    owner: 'self'
                }),
                ability.actions.addSideAction({ amount: 2 })
            ]
        });
    }
}

Accelerate.id = 'accelerate';

module.exports = Accelerate;
