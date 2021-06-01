const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Butterfly Monk',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Natural)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'butterfly-monk'
            })
        });
    }
}

SummonButterflyMonk.id = 'summon-butterfly-monk';

module.exports = SummonButterflyMonk;
