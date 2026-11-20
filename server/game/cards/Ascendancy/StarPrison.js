const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class StarPrison extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [ability.effects.exhausted()]
        });

        this.forcedReaction({
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            target: {
                toSelect: 'die',
                mode: 'upTo',
                numDice: 1,
                owner: 'self',
                dieCondition: (die) => die.level === Level.Class,
                gameAction: ability.actions.lowerDie()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.conditional((context) => ({
                    condition: (con) => con.preThenEvent?.context.diceChangeCount > 0,
                    falseGameAction: ability.actions.discard({ target: context.source })
                }))
            }
        });
    }
}

StarPrison.id = 'star-prison';

module.exports = StarPrison;
