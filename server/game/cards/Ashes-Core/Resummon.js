const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Resummon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Resummon',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Class, Magic.Illusion)
                ])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.putIntoPlay((context) => ({
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

Resummon.id = 'resummon';

module.exports = Resummon;
