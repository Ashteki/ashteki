const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonThunderHulk extends Card {
    setupCardAbilities(ability) {
        this.summon('thunder-hulk', {
            title: 'Summon Thunder Hulk',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Artifice),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard'
        });
    }
}

SummonThunderHulk.id = 'summon-thunder-hulk';

module.exports = SummonThunderHulk;
