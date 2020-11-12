const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSilverSnake extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Silver Snake',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Power, Magic.Charm),
                    new DiceCount(1, Level.Power, Magic.Natural)
                ])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'silver-snake',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonSilverSnake.id = 'summon-silver-snake';

module.exports = SummonSilverSnake;
