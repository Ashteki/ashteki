const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Butterfly Monk',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Natural)])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'butterfly-monk',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonButterflyMonk.id = 'summon-butterfly-monk';

module.exports = SummonButterflyMonk;
