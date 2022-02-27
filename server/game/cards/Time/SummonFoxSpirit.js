const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFoxSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Fox Spirit',
            cost: [
                this.focus > 0 ? ability.costs.chosenAction() : ability.costs.mainAction(),
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
