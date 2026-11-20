const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonScrapHound extends Card {
    setupCardAbilities(ability) {
        this.summon('scrap-hound', {
            title: 'Summon Scrap Hound',
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

SummonScrapHound.id = 'summon-scrap-hound';

module.exports = SummonScrapHound;
