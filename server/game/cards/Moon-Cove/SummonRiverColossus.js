const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonRiverColossus extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon River Colossus',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(2, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'river-colossus'
            }),
            then: {
                // focus 1 ability
                alwaysTriggers: true,
                condition: () => this.focus >= 2,
                gameAction: ability.actions.changeDice({
                    dieCondition: (die) => !die.exhausted,
                    numDice: 4,
                    owner: 'self'
                })
            }
        });
    }
}

SummonRiverColossus.id = 'summon-river-colossus';

module.exports = SummonRiverColossus;
