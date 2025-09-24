const PlayerAction = require('./PlayerAction');

class DiscardTopOfDeckAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'deck';
        this.damageIfEmpty = false;
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
        if (this.amount === 0 || (player.deck.length === 0 && !this.damageIfEmpty)) {
            return false;
        } else return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player, context }, () => {
            let discardAmount = Math.min(this.amount, player.deck.length);
            let damageAmount = 0;
            if (discardAmount < this.amount && this.damageIfEmpty) {
                damageAmount = this.amount - discardAmount;
            }
            context.discardedCards = player.deck.slice(0, discardAmount);
            context.game.addMessage(
                '{0} discards {1} from the top of their deck',
                player,
                context.discardedCards
            );

            context.game.actions.discard().resolve(context.discardedCards, context);

            if (damageAmount > 0) {
                context.game.addMessage(
                    '{0} takes {1} damage due to an empty deck',
                    player,
                    damageAmount
                );
                context.game.actions
                    .addDamageToken({ amount: damageAmount })
                    .resolve(player.phoenixborn, context);
            }
        });
    }
}

module.exports = DiscardTopOfDeckAction;
