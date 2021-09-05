const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonWingedLioness extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Winged Lioness',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Divine),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'winged-lioness'
            })
        });
    }
}

SummonWingedLioness.id = 'summon-winged-lioness';

module.exports = SummonWingedLioness;
