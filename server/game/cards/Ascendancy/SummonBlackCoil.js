const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonBlackCoil extends Card {
    setupCardAbilities(ability) {
        this.summon('black-coil', {
            title: 'Summon Black Coil',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Astral)]),
                ability.costs.chosenDiscard(1, false)
            ],
            location: 'spellboard'
        });
    }
}

SummonBlackCoil.id = 'summon-black-coil';

module.exports = SummonBlackCoil;
