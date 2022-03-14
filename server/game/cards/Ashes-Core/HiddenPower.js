const Card = require('../../Card.js');

class HiddenPower extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Draw a card and change 5 dice',
            gameAction: ability.actions.draw(),
            then: {
                gameAction: ability.actions.changeDice({
                    dieCondition: (die) => !die.exhausted,
                    numDice: 5,
                    owner: 'self'
                })
            }
        });
    }
}

HiddenPower.id = 'hidden-power';

module.exports = HiddenPower;
