const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.summon('butterfly-monk', {
            title: 'Summon Butterfly Monk',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Natural)])
            ],
            location: 'spellboard'
        });
    }
}

SummonButterflyMonk.id = 'summon-butterfly-monk';

module.exports = SummonButterflyMonk;
