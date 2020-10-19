const DiceGameAction = require('./DiceGameAction');

class DetachDieAction extends DiceGameAction {
    setDefaultProperties() {
        this.die = null;
        this.card = null;
        this.upgradeChosenOnResolution = false;
    }

    setup() {
        this.name = 'detachDie';

        this.effectMsg = 'detach {1} from {0}';
        this.effectArgs = () => {
            return this.die;
        };
    }

    // attaching to a card, can this card have a dice attached.
    canAffect(card, context) {
        // only valid in the play area
        if (!context || !context.player || !card || card.location !== 'play area') {
            return false;
        } else if (this.upgradeChosenOnResolution) {
            return super.canAffect(card, context);
        }

        return super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }

    getEvent(targetCard, context) {
        return super.createEvent(
            'onDieDetached',
            { die: this.die, parent: this.card, context: context },
            (event) => {
                event.die.parent.removeDieAttachment(event.die);
                event.die.owner.dice.push(event.die);
                event.die.moveTo('dicepool');
            }
        );
    }
}

module.exports = DetachDieAction;
