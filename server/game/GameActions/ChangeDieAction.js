const DiceGameAction = require('./DiceGameAction');

class ChangeDieAction extends DiceGameAction {
    constructor(propertyFactory, change = 'raise') {
        super(propertyFactory);
        this.change = change;
    }

    setDefaultProperties() {
        this.showMessage = false;
    }

    setup() {
        super.setup();
        // this.name = this.change + 'Die';
        this.name = 'changeDie';
        this.effectMsg = this.change + ' die {0}';
    }

    getEvent(die, context) {
        if (this.showMessage) {
            if (this.change == 'lower') {
                context.game.addMessage('{0} lowers a {1} die', context.player, die);
            }
            if (this.change == 'raise') {
                context.game.addMessage('{0} raises a {1} die', context.player, die);
            }
        }
        return super.createEvent(
            'onDieChange',
            { die: die, context: context, change: this.change, diceOwner: die.owner },
            () => (this.change == 'raise' ? die.raise() : die.lower())
        );
    }
}

module.exports = ChangeDieAction;
