const DiceGameAction = require('./DiceGameAction');

class ChangeDieAction extends DiceGameAction {
    constructor(propertyFactory, change = 'raise') {
        super(propertyFactory);
        this.change = change;
    }

    setup() {
        super.setup();
        // this.name = this.change + 'Die';
        this.name = 'changeDie';
        this.effectMsg = this.change + ' die {0}';
    }

    getEvent(die, context) {
        return super.createEvent('onDieChange', { die: die, context: context }, () =>
            this.change == 'raise' ? die.raise() : die.lower()
        );
    }
}

module.exports = ChangeDieAction;
