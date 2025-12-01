const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSparkDrone extends Card {
    setupCardAbilities(ability) {
        this.summon('spark-drone', {
            title: 'Summon Spark Drone',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Artifice)])
            ],
            location: 'spellboard',
            then: {
                gameAction: ability.actions.changeDice((context) => ({
                    numDice: 2,
                    owner: 'self',
                    dieCondition: (die) => !die.exhausted
                }))
            }
        });
    }
}

SummonSparkDrone.id = 'summon-spark-drone';

module.exports = SummonSparkDrone;
