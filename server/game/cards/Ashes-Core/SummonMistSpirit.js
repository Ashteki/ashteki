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
            gameAction: ability.actions.summon({
                conjuration: 'mist-spirit'
            }),
            then: {
                optional: true,
                activePromptTitle: 'Summon another Mist Spirit?',
                cost: ability.costs.dice([new DiceCount(1, Level.Basic)]),
                gameAction: ability.actions.summon({
                    conjuration: 'mist-spirit'
                })
            }
        });
    }
}

SummonMistSpirit.id = 'summon-mist-spirit';

module.exports = SummonMistSpirit;
