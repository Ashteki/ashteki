const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonGalewindHawk extends Card {
    setupCardAbilities(ability) {
        this.summon('galewind-hawk', {
            title: 'Summon Galewind Hawk',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Astral),
                    new DiceCount(1, Level.Class, Magic.Natural)
                ])
            ],
            location: 'spellboard'
        });
    }
}

SummonGalewindHawk.id = 'summon-galewind-hawk';

module.exports = SummonGalewindHawk;
