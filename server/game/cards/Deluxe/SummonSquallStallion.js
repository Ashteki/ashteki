const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSquallStallion extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Squall Stallion',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.draw(),
            then: {
                alwaysTriggers: true,
                target: {
                    controller: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'squall-stallion',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay()
                }
            }
        });
    }
}

SummonSquallStallion.id = 'summon-squall-stallion';

module.exports = SummonSquallStallion;
