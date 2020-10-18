const DiceGameAction = require('./DiceGameAction');

class ChangeDieAction extends DiceGameAction {
    constructor(propertyFactory, change = 'raise') {
        super(propertyFactory);
        this.change = change;
    }

    setup() {
        this.name = this.change + 'Die';
        this.effectMsg = this.change + ' die {0}';
        this.targetType = ['die'];
    }

    getEvent(die, context) {
        return super.createEvent('onDieChange', { die: die, context: context }, () =>
            this.change == 'raise' ? die.raise() : die.lower()
        );
    }
}

module.exports = ChangeDieAction;
