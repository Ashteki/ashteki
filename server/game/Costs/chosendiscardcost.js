class ChosenDiscardCost {
    constructor(properties) {
        this.amount = properties.amount;
        this.allowCancel = !!properties.allowCancel;
    }

    canPay(context) {
        return context.player.hand.filter((c) => c !== context.source).length >= this.amount;
    }

    payEvent(context) {
        return context.game.actions
            .chosenDiscard({ amount: this.amount, asCost: true, allowCancel: this.allowCancel })
            .getEvent(context.player, context);
    }
}

module.exports = ChosenDiscardCost;
