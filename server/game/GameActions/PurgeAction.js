const CardGameAction = require('./CardGameAction');

class PurgeAction extends CardGameAction {
    setDefaultProperties() {
        this.reveal = true;
    }

    setup() {
        super.setup();
        this.name = 'purge';
        this.effectMsg = this.reveal ? 'remove {0} from the game' : 'remove a card from the game';
    }

    getEvent(card, context) {
        return super.createEvent('onCardPurged', { card: card, context: context }, () => {
            if (card.location === 'play area' || card.location === 'spellboard') {
                context.game.raiseEvent('onCardLeavesPlay', { card, context }, () =>
                    card.owner.moveCard(card, 'purged')
                );
            } else {
                card.owner.moveCard(card, 'purged');
            }
        });
    }
}

module.exports = PurgeAction;
