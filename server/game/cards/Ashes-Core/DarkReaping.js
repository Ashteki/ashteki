const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DarkReaping extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Destroy a unit and change 5 dice',
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
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

DarkReaping.id = 'dark-reaping';

module.exports = DarkReaping;
