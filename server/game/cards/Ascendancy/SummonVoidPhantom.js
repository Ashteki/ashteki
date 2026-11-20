const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonVoidPhantom extends Card {
    setupCardAbilities(ability) {
        this.summon('void-phantom', {
            title: 'Summon Void Phantom',
            cost: ability.costs.chosenOptionCost([
                {
                    text: 'Main',
                    costs: [
                        ability.costs.mainAction(),
                        ability.costs.exhaust(),
                        ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion), new DiceCount(1, Level.Basic)])
                    ]
                },
                {
                    text: 'Side',
                    costs: [
                        ability.costs.sideAction(),
                        ability.costs.exhaust(),
                        ability.costs.oppHasNoActiveNonBasic(),
                        ability.costs.dice([new DiceCount(2, Level.Class, Magic.Illusion)])
                    ]
                }
            ]),
            location: 'spellboard'
        });
    }
}

SummonVoidPhantom.id = 'summon-void-phantom';

module.exports = SummonVoidPhantom;
