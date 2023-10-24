const DiceGameAction = require('./DiceGameAction');

class RemoveDieAction extends DiceGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
    }

    setDefaultProperties() {
        this.showMessage = false;
    }

    setup() {
        super.setup();
        // this.name = this.change + 'Die';
        this.name = 'changeDie';
        this.effectMsg = 'remove die {0}';
    }

    getEvent(die, context) {
        if (this.showMessage) {
            context.game.addMessage('{0} removes a {1} die', context.player, die);
        }
        return super.createEvent(
            'onDieChange',
            { die: die, context: context, diceOwner: die.owner },
            (event) => {
                // remove it
                const index = event.diceOwner.dice.indexOf(die);
                event.diceOwner.dice.splice(index, 1);
            }
        );
    }
}

module.exports = RemoveDieAction;
