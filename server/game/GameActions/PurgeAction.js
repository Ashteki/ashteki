const CardGameAction = require('./CardGameAction');

class PurgeAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'purge';
        this.effectMsg = 'remove {0} from the game';
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
