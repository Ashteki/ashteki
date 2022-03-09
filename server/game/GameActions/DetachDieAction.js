const DiceGameAction = require('./DiceGameAction');

class DetachDieAction extends DiceGameAction {
    setDefaultProperties() {
        this.die = null;
    }

    setup() {
        super.setup();
        this.name = 'detachDie';
    }

    // this is a bit awkward - detachDieAction is used as a card interrupt in reimagine end/round
    // it is overridden by direct set targets when used in dicecost
    defaultTargets(context) {
        return context.source.dieUpgrades;
    }

    canAffect(die, context) {
        // only valid in the play area
        if (!context || !context.player || !die || die.location !== 'play area' || !die.parent) {
            return false;
        }

        return super.canAffect(die, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.die, event.context);
    }

    getEvent(die, context) {
        return super.createEvent('onDieDetached', { die: die, context: context }, (event) => {
            event.die.parent.removeDieAttachment(event.die);
            event.die.exhaust();
            event.die.parent = null;
            event.die.owner.dice.push(event.die);
            event.die.moveTo('dicepool');
        });
    }
}

module.exports = DetachDieAction;
