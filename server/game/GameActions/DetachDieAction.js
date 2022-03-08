const DiceGameAction = require('./DiceGameAction');

class DetachDieAction extends DiceGameAction {
    setDefaultProperties() {
        this.die = null;
    }

    setup() {
        super.setup();
        this.name = 'detachDie';
    }

    // attaching to a card, can this card have a dice attached.
    canAffect(die, context) {
        // only valid in the play area
        if (!context || !context.player || !die || die.location !== 'play area' || !die.parent) {
            return false;
        }

        return super.canAffect(die, context);
    }

    // checkEventCondition(event) {
    //     return this.canAffect(event.parent, event.context);
    // }

    getEvent(die, context) {
        return super.createEvent('onDieDetached', { die: die, context: context }, (event) => {
            event.die.parent.removeDieAttachment(event.die);
            event.die.parent = null;
            event.die.owner.dice.push(event.die);
            event.die.moveTo('dicepool');
        });
    }
}

module.exports = DetachDieAction;
