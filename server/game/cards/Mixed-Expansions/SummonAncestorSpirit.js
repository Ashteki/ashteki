const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonAncestorSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Ancestor Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Sympathy)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'ancestor-spirit'
            })
        });
    }
}

SummonAncestorSpirit.id = 'summon-ancestor-spirit';

module.exports = SummonAncestorSpirit;
