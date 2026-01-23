const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Whirlwind extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Whirlwind',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: 2,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.phoenixborn.isAirborne,
                gameAction: ability.actions.draw()
            }
        });
    }
}

Whirlwind.id = 'whirlwind';

module.exports = Whirlwind;
