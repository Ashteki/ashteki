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

        // don't allow changes to dice that are hosted on a card
        if (die.parent) {
            return false;
        }
        return super.canAffect(die, context);
    }

    checkEventCondition(event) {
        return super.checkEventCondition(event);
    }

    getEvent(die, context) {
        return super.createEvent('onDieChange', { die: die, context: context }, (event) => {
            die.level = this.level;
            event.context.diceChangeCount = 1 + (event.context.diceChangeCount || 0);
        });
    }
}

module.exports = SetDieLevelAction;
