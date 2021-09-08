const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.refill = false;
        this.bonus = false;
        this.damageIfEmpty = false;
        this.singleCopy = false;
        this.showMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'draw';
        this.effectMsg = 'draw ' + this.amount + ' cards';
    }

    canAffect(player, context) {
        return (this.amount !== 0 || this.refill) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        let amount = 0;
        if (this.refill) {
            if (player.maxHandSize > player.hand.length) {
                amount = player.maxHandSize - player.hand.length;
            }
        } else {
            amount = this.amount;
        }

        if (this.showMessage || (this.refill && amount > 0)) {
            context.game.addMessage(
                '{0} draws {1} {2}{3}',
                player,
                amount,
                amount > 1 ? 'cards' : 'card',
                this.refill ? ` to their maximum of ${player.maxHandSize}` : ''
            );
        }

        return super.createEvent(
            'onDrawCards',
            {
                player: player,
                amount: amount,
                bonus: this.bonus,
                context: context
            },
            (event) => {
                if (event.amount > 0) {
                    event.player.drawCardsToHand(amount, this.damageIfEmpty, this.singleCopy);
                }
            }
        );
    }
}

module.exports = DrawAction;
