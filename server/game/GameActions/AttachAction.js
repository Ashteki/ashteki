const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AttachAction extends CardGameAction {
    setDefaultProperties() {
        this.upgrade = null;
        this.upgradeChosenOnResolution = false;
        this.giveControl = false;
        this.canTakeUpgradeInPlay = false;
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

        if (
            !this.upgrade ||
            (this.upgrade.location === 'play area' && !this.canTakeUpgradeInPlay) ||
            !this.upgrade.canAttach(card, context) ||
            (card.anyEffect('cannotBeSpellTarget') && context.player !== card.controller)
        ) {
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
        const attachedEvent = context.game.getEvent(
            'onCardAttached',
            { card: this.upgrade, parent: card, context: context, giveControl: this.giveControl },
            (event) => {
                if (event.card.location === 'play area' && event.card.parent) {
                    event.card.parent.removeAttachment(event.card);
                } else {
                    event.card.controller.removeCardFromPile(event.card);
                    event.card.new = true;
                    event.card.moveTo('play area');
                    // all attachments become controlled by the controller of the parent / host
                    // if (event.card.ownerControlled) {
                    // }
                }

                event.parent.upgrades.push(event.card);
                event.card.parent = event.parent;
            }
        );

        const result = context.game.getEvent(
            'onAttachingCard', { card: this.upgrade, parent: card }, (event) => {
                context.game.openEventWindow(attachedEvent);
                context.game.queueSimpleStep(() => {
                    event.card.setDefaultController(event.parent.controller);
                });
            }
        );

        return result;
    }
}

module.exports = AttachAction;
