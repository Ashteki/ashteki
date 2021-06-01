const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonBiter extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Biter',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Natural),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'biter'
            })
        });
    }
}

SummonBiter.id = 'summon-biter';

module.exports = SummonBiter;
