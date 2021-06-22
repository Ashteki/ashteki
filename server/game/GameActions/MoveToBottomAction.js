const CardGameAction = require('./CardGameAction');

class MoveToBottomAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'moveToBottom';
        this.effectMsg = 'put a card at the bottom of the deck';
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            card.owner.moveToBottom(card);
        });
    }
}

module.exports = MoveToBottomAction;
