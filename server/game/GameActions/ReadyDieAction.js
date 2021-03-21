const DiceGameAction = require('./DiceGameAction');

class ReadyDieAction extends DiceGameAction {
    setup() {
        this.name = 'readyDie';
        this.effectMsg = 'ready die {0}';
        this.targetType = ['die'];
    }

    checkEventCondition(event) {
        return event.die.exhausted && super.checkEventCondition(event);
    }

    getEvent(die, context) {
        return super.createEvent('onDieReadied', { die: die, context: context }, () => die.ready());
    }
}

module.exports = ReadyDieAction;
