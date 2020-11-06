const Card = require('../../Card.js');

class HiddenPower extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Draw a card and change 5 dice',
            gameAction: ability.actions.draw(),
            then: {
                target: {
                    toSelect: 'die',
                    dieCondition: (d) => !d.exhausted,
                    mode: 'upTo',
                    numDice: 5,
                    owner: 'self',
                    gameAction: ability.actions.setDieLevel({ level: 'power' }) //todo: choice
                }
            }
        });
    }
}

HiddenPower.id = 'hidden-power';

module.exports = HiddenPower;
