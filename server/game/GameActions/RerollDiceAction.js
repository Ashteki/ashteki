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
                'onDiceRerolled',
                {
                    dice: this.target,
                    diceCopy: this.target.map(d => d.clone()),
                    context: context,
                    diceOwner: this.target[0].owner
                },
                (event) => {
                    event.dice.forEach((d) => {
                        d.roll();
                    });
                    context.game.addMessage('{0} rolls {1}', event.diceOwner, event.dice);
                }
            )
        ];
    }
}

module.exports = RerollDiceAction;
