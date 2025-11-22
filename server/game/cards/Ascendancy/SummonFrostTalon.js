const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFrostTalon extends Card {
    setupCardAbilities(ability) {
        this.summon('frost-talon', {
            title: 'Summon Frost Talon',
            cost: [
                ability.costs.mainAction(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Astral)])
            ],
            location: 'spellboard'
        });
    }
}

SummonFrostTalon.id = 'summon-frost-talon';

module.exports = SummonFrostTalon;
