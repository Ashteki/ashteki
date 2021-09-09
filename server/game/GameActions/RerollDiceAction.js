const Dice = require('../dice');
const DiceGameAction = require('./DiceGameAction');

class RerollDiceAction extends DiceGameAction {
    setup() {
        this.name = 'rerollDice';
        this.effectMsg = 'reroll dice: {0}';
        this.targetType = ['die'];
    }

    checkEventCondition(event) {
        return true;
        // return !event.dice.some((d) => d.exhausted) && super.checkEventCondition(event);
    }

    getEventArray(context) {
        return [
            super.createEvent(
                'unnamedEvent',
                { dice: context.target, context: context },
                (event) => {
                    event.dice.forEach(d => {
                        d.level = Dice.getRandomDieLevel();
                    });
                    context.game.addMessage('{0} rolls {1}', event.dice[0].owner, event.dice);
                }
            )
        ];
    }
}

module.exports = RerollDiceAction;
