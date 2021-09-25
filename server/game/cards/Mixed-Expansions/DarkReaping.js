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
                gameAction: ability.actions.changeDice({
                    numDice: 5,
                    owner: 'self'
                })
            }
        });
    }
}

DarkReaping.id = 'dark-reaping';

module.exports = DarkReaping;
