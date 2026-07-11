const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonStormSpirit extends Card {
    setupCardAbilities(ability) {
        this.summon('storm-spirit', {
            title: 'Summon Storm Spirit',
            cost: ability.costs.chosenOptionCost([
                {
                    text: 'Main',
                    costs: [
                        ability.costs.mainAction(),
                        ability.costs.exhaust(),
                        ability.costs.dice([new DiceCount(1, Level.Class, Magic.Astral)])
                    ]
                },
                {
                    text: 'Side',
                    costs: [
                        ability.costs.focus(1),
                        ability.costs.sideAction(),
                        ability.costs.anyHostedAstralDie(),
                        ability.costs.exhaust(),
                        ability.costs.dice([new DiceCount(1, Level.Basic)])
                    ]
                }
            ]),
            location: 'spellboard'
        });
    }
}

SummonStormSpirit.id = 'summon-storm-spirit';

module.exports = SummonStormSpirit;
