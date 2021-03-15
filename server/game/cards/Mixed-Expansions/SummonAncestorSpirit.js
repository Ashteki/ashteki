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
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'ancestor-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonAncestorSpirit.id = 'summon-ancestor-spirit';

module.exports = SummonAncestorSpirit;
