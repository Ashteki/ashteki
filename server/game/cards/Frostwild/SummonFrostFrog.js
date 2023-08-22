const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFrostFrog extends Card {
    setupCardAbilities(ability) {
        this.summon('frost-frog', {
            title: 'Summon Frost Frog',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Natural)])
            ],
            location: 'spellboard'
        });
    }
}

SummonFrostFrog.id = 'summon-frost-frog';

module.exports = SummonFrostFrog;
