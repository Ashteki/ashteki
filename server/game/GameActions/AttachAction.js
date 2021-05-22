const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AttachAction extends CardGameAction {
    setDefaultProperties() {
        this.upgrade = null;
        this.upgradeChosenOnResolution = false;
        this.giveControl = false;
    }

    setup() {
        this.name = 'attach';
        this.targetType = BattlefieldTypes;
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.upgrade;
        };
    }

    canAffect(card, context) {
        if (!context || !context.player || !card || card.location !== 'play area') {
            return false;
        } else if (this.upgradeChosenOnResolution) {
            return super.canAffect(card, context);
        }

        if (!this.upgrade || !this.upgrade.canAttach(card, context)) {
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

    getEvent(card, context) {
        return super.createEvent(
            'onCardAttached',
            { card: this.upgrade, parent: card, context: context, giveControl: this.giveControl },
            (event) => {
                if (event.card.location === 'play area' && event.card.parent) {
                    event.card.parent.removeAttachment(event.card);
                } else {
                    event.card.controller.removeCardFromPile(event.card);
                    event.card.new = true;
                    // all attachments become controlled by the controller of the parent / host
                    // if (event.card.ownerControlled) {
                    event.card.setDefaultController(event.parent.controller);
                    // }

                    event.card.moveTo('play area');
                }

                event.parent.upgrades.push(event.card);
                event.card.parent = event.parent;
            }
        );
    }
}

module.exports = AttachAction;
