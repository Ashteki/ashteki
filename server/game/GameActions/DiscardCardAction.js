const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    setDefaultProperties() {
        this.showMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    getEvent(card, context) {
        let location = card.location;
        const params = { card, context, location, showMessage: this.showMessage };

        // leaving play event
        const leavesPlayEvent = context.game.getEvent(
            card.location === 'play area' || card.location === 'spellboard'
                ? 'onCardLeavesPlay'
                : 'unnamedevent',
            params,
            (lpEvent) => {
                lpEvent.card.owner.moveCard(lpEvent.card, lpEvent.card.discardLocation);
            }
        );

        const discardEvent = super.createEvent(
            'onCardDiscarded',
            params,
            (event) => {
                if (card.location === 'hand') {
                    context.game.cardsDiscarded.push(card);
                }
                card.removed = true;

                if (event.showMessage || this.showMessage) {
                    const discardingPlayer = this.player || context.player;
                    context.game.addMessage('{0} discards {1}', discardingPlayer, card);
                }

            }
        );
        discardEvent.addSubEvent(leavesPlayEvent)

        return discardEvent;
    }
}

module.exports = DiscardCardAction;
