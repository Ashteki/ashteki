const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonShadowSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Shadow Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Illusion)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'shadow-spirit'
            })
        });
    }
}

SummonShadowSpirit.id = 'summon-shadow-spirit';

module.exports = SummonShadowSpirit;
