const CardGameAction = require('./CardGameAction');

class ReturnToHandAction extends CardGameAction {
    setDefaultProperties() {
        this.location = ['play area', 'spellboard'];
        this.showMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'returnToHand';
        this.effectMsg = 'return {0} to their hand';
        this.cost = "returning {0} to their owner's hand";

        if (!Array.isArray(this.location)) {
            this.location = [this.location];
        }
    }

    canAffect(card, context) {
        if (!this.location.includes(card.location)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let eventName =
            card.location === 'play area' || card.location === 'spellboard'
                ? 'onCardLeavesPlay'
                : 'onMoveCard';

        return super.createEvent(
            eventName,
            { card: card, player: card.owner, context: context },
            (event) => {
                event.player.moveCard(event.card, 'hand')
                if (this.showMessage) {
                    context.game.addMessage(
                        "{0} is returned to {1}'s hand",
                        event.card,
                        event.player
                    );
                }
            }
        );
    }
}

module.exports = ReturnToHandAction;
