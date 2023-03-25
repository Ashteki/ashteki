const DiceGameAction = require('./DiceGameAction');

class RerollDieAction extends DiceGameAction {
    setup() {
        this.name = 'rerollDie';
        this.effectMsg = 'reroll die {0}';
        this.targetType = ['die'];
    }

    checkEventCondition(event) {
        return !event.die.exhausted && super.checkEventCondition(event);
    }

    getEvent(die, context) {
        return super.createEvent('unnamedEvent', { die: die, context: context }, () => die.roll());
    }
}

module.exports = RerollDieAction;
