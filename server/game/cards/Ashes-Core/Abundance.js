const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Abundance extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Abundance',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.chosenAmountDraw((context) => {
                let prevention = {};
                prevention[context.player.uuid] = context.source.focus;
                prevention[context.player.opponent.uuid] = 0;

                return {
                    remainderDamages: true,
                    prevention: prevention,
                    promptTitle: 'Abundance',
                    menuTitle: 'Draw or damage: choose number of cards to draw'
                };
            })
        });
    }
}

Abundance.id = 'abundance';

module.exports = Abundance;
