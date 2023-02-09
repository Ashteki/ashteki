const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonWingedLioness extends Card {
    setupCardAbilities(ability) {
        this.summon('winged-lioness', {
            location: 'spellboard',
            title: 'Summon Winged Lioness',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Divine),
                    new DiceCount(1, Level.Basic)
                ])
            ]
        });
    }
}

SummonWingedLioness.id = 'summon-winged-lioness';

module.exports = SummonWingedLioness;
