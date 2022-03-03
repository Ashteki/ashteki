const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFoxSpirit extends Card {
    setupCardAbilities(ability) {
        // would prefer to just vary the cost, but had trouble incorporating card focus into the array
        this.action({
            title: 'Summon Fox Spirit',
            condition: () => this.focus == 0,
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'fox-spirit'
            })
        });
        this.action({
            title: 'Summon Fox Spirit',
            condition: () => this.focus > 0,
            cost: [
                ability.costs.chosenAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'fox-spirit'
            })
        });
    }
}

SummonFoxSpirit.id = 'summon-fox-spirit';

module.exports = SummonFoxSpirit;
