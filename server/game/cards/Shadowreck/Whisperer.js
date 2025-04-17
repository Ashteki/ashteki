const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Whisperer extends Card {
    setupCardAbilities(ability) {
        return this.destroyed({
            inexhaustible: true,
            gameAction: ability.actions.conditional({
                condition: (context) =>
                    context.player.opponent.dice.some(
                        (d) => d.level === Level.Power && !d.exhausted
                    ),
                trueGameAction: ability.actions.lowerDie({
                    promptForSelect: {
                        mode: 'upTo',
                        numDice: this.getAbilityNumeric(1),
                        activePromptTitle: 'Haunt: Choose a power die to lower',
                        dieCondition: (die) => die.level === Level.Power && !die.exhausted,
                        owner: 'opponent'
                    },
                    showMessage: true
                }),
                falseGameAction: ability.actions.dealDamage((context) => ({
                    target: context.player.opponent.phoenixborn,
                    showMessage: true
                }))
            })
        });
    }
}

Whisperer.id = 'whisperer';

module.exports = Whisperer;
