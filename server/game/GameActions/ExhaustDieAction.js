const DiceGameAction = require('./DiceGameAction');

class ExhaustDieAction extends DiceGameAction {
    setup() {
        this.name = 'exhaustDie';
        this.effectMsg = 'exhaust die {0}';
        this.targetType = ['die'];
    }

    canAffect(die, context) {
        return super.canAffect(die, context);
    }

    checkEventCondition(event) {
        return !event.die.exhausted && super.checkEventCondition(event);
    }

    getEvent(die, context) {
        return super.createEvent('onDieExhausted', { die: die, context: context }, () =>
            die.exhaust()
        );
    }
}

module.exports = ExhaustDieAction;
