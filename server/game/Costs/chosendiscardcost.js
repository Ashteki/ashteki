class ChosenDiscardCost {
    constructor(properties) {
        this.amount = properties.amount;
        this.allowCancel = !!properties.allowCancel;
        this.cardType = properties.cardType;
    }

    canPay(context) {
        let cards = context.player.hand.filter((c) => c !== context.source);
        if (this.cardType) {
            cards = cards.filter((c) => c.type === this.cardType);
        }
        return cards.length >= this.amount;
    }

    resolve(context, result) {
        const promptProps = {
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
        };
        if (this.cardType) {
            promptProps.cardType = this.cardType;
        }
        context.game.promptForSelect(context.player, promptProps);
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
