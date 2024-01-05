class ChosenDiscardCost {
    constructor(properties) {
        this.amount = properties.amount;
    }

    canPay(context) {
        return context.player.hand.filter((c) => c !== context.source).length >= this.amount;
    }

    payEvent(context) {
        return context.game.actions
            .chosenDiscard({ amount: this.amount, asCost: true })
            .getEvent(context.player, context);
    }
}

module.exports = ChosenDiscardCost;
