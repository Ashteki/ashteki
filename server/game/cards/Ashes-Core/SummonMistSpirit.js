const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMistSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Mist Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'mist-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                optional: true,
                cost: ability.costs.dice([new DiceCount(1, Level.Basic)]),
                target: {
                    player: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'mist-spirit',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay()
                }
            }
        });
    }
}

SummonMistSpirit.id = 'summon-mist-spirit';

module.exports = SummonMistSpirit;
