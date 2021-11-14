const PlayerAction = require('./PlayerAction');

class DiscardTopOfDeckAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'deck';
    }

    setup() {
        super.setup();
        this.name = 'discard-top-of-deck';
        this.effectMsg =
            'make {0} discard ' +
            (this.amount === 1 ? 'a card' : this.amount + ' cards') +
            ' from their ' +
            this.location;
    }

    canAffect(player, context) {
        if (this.amount === 0 || player.deck.length === 0) {
            return false;
        } else return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player, context }, () => {
            let amount = Math.min(this.amount, player.deck.length);

            let cards = player.deck.slice(0, amount);

            context.game.addMessage('{0} discards {1} from the top of their deck', player, cards);
            context.game.actions.discard().resolve(cards, context);
        });
    }
}

module.exports = DiscardTopOfDeckAction;
