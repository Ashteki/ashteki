const DiceGameAction = require('./DiceGameAction');

// set a die to a specific level
class SetDieLevelAction extends DiceGameAction {
    setDefaultProperties() {
        this.level = 'class';
    }

    setup() {
        this.name = 'setDieLevel';
        this.effectMsg = 'set die level {0}';
        this.targetType = ['die'];
    }

    canAffect(die, context) {
        if (die.level === this.level) {
            return false;
        }

        return super.canAffect(die, context);
    }

    checkEventCondition(event) {
        return super.checkEventCondition(event);
    }

    getEvent(die, context) {
        return super.createEvent(
            'onDieLevelSet',
            { die: die, context: context },
            () => (die.level = this.level)
        );
    }
}

module.exports = SetDieLevelAction;
