const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonIronRhino extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Iron Rhino',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dynamicDice((context) => {
                    return [new DiceCount(6 - context.source.focus, Level.Basic)];
                })
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'iron-rhino',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonIronRhino.id = 'summon-iron-rhino';

module.exports = SummonIronRhino;
