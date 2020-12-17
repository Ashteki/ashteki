const { BattlefieldTypes } = require('../../constants');
const DiceGameAction = require('./DiceGameAction');

class AttachDieAction extends DiceGameAction {
    setDefaultProperties() {
        this.upgradeDie = null;
        this.upgradeChosenOnResolution = false;
    }

    setup() {
        this.name = 'attach';

        // can only affect units
        this.targetType = BattlefieldTypes;
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.upgradeDie;
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

        if (!this.upgradeDie || !this.upgradeDie.canAttach(card, context)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }

    getEventArray(context) {
        this.upgradeChosenOnResolution = false;
        return super.getEventArray(context);
    }

    getEvent(targetCard, context) {
        return super.createEvent(
            'onDieAttached',
            { die: this.upgradeDie, parent: targetCard, context: context },
            (event) => {
                if (event.die.location === 'play area') {
                    event.die.parent.removeDieAttachment(event.die);
                } else {
                    event.die.owner.removeDieFromPool(event.die);
                    event.die.new = true;
                    event.die.moveTo('play area');
                }

                event.parent.dieUpgrades.push(event.die);
                event.die.parent = event.parent;
                if (event.die.owner !== event.context.player) {
                    event.die.owner = event.context.player;
                    event.die.updateEffectContexts();
                }
            }
        );
    }
}

module.exports = AttachDieAction;
