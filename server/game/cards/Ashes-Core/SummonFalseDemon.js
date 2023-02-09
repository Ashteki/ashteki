const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFalseDemon extends Card {
    setupCardAbilities(ability) {
        this.summon('false-demon', {
            title: 'Summon False Demon',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Illusion),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard'
        });
    }
}

SummonFalseDemon.id = 'summon-false-demon';

module.exports = SummonFalseDemon;
