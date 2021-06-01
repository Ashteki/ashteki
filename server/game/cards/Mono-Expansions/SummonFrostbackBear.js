const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFrostbackBear extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Frostback Bear',
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
                conjuration: 'frostback-bear'
            })
        });
    }
}

SummonFrostbackBear.id = 'summon-frostback-bear';

module.exports = SummonFrostbackBear;
