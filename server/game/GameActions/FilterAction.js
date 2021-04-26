const PlayerAction = require('./PlayerAction');

class FilterAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'filter';
        this.effectMsg = 'filter ' + this.amount + ' cards';
    }

    canAffect(player, context) {
        return (this.amount !== 0 || player.deck.length > 1) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(
            'onDrawCards',
            {
                player: player,
                amount: this.amount,
                context: context
            },
            (event) => {
                if (event.amount > 0) {
                    // event.player.drawCardsToHand(event.amount, this.damageIfEmpty, this.singleCopy);
                }
            }
        );
    }
}

module.exports = FilterAction;
