const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSeafoamSnapper extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Seafoam Snapper',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Time)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'seafoam-snapper'
            })
        });
    }
}

SummonSeafoamSnapper.id = 'summon-seafoam-snapper';

module.exports = SummonSeafoamSnapper;
