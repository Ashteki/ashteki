class ChosenDiscardCost {
    constructor(properties) {
        this.amount = properties.amount;
        this.allowCancel = !!properties.allowCancel;
    }

    canPay(context) {
        return context.player.hand.filter((c) => c !== context.source).length >= this.amount;
    }

    resolve(context, result) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: this.amount === 1
                ? 'Choose a card to discard'
                : {
                    text: 'Choose {{amount}} cards to discard',
                    values: { amount: this.amount }
                },
            context: context,
            mode: 'exactly',
            numCards: this.amount,
            location: 'hand',
            controller: 'self',
            cardCondition: (card, context) => card !== context.source,
            onSelect: (player, cards) => {
                context.costs.discardedCards = cards;
                return true;
            },
            onCancel: () => {
                result.cancelled = true;
                return true;
            },
            showCancel: this.allowCancel
        });
    }

    payEvent(context) {
        const wrapper = context.game.getEvent('unnamedEvent', { player: context.player });
        context.costs.discardedCards.forEach((card) => {
            wrapper.addChildEvent(context.game.actions.discard().getEvent(card, context));
        });
        return wrapper;
    }
}

module.exports = ChosenDiscardCost;
