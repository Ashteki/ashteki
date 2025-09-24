const PlayerAction = require('./PlayerAction');

class ChosenDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.asCost = false;
        this.allowTopOfDeck = false;
        this.location = ['hand'];
        this.allowCancel = false;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard ' + this.amount + ' cards';
        this.cards = {};
    }

    canAffect(player, context) {
        if (!this.playerCanDiscard(player) || this.amount === 0) {
            return false;
        }

        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player }, () => {
            const hand = player.getHand();
            if (hand.length > 0) {
                let amount = Math.min(hand.length, this.amount);
                if (amount > 0) {
                    const promptProps = {
                        activePromptTitle: amount === 1
                            ? 'Choose a card to discard'
                            : {
                                text: 'Choose {{amount}} cards to discard',
                                values: { amount: amount }
                            },
                        context: context,
                        mode: 'exactly',
                        numCards: amount,
                        location: this.location,
                        controller: player === context.player ? 'self' : 'opponent',
                        cardCondition: (card, context) => card !== context.source,
                        onSelect: (player, cards) => {
                            if (this.asCost) {
                                context.costs.discardedCards = cards;
                            }
                            context.game.addMessage('{0} discards {1}', player, cards);
                            context.game.actions.discard().resolve(cards, context);
                            context.game.actions
                                .releaseChimeraHand()
                                .resolve(player.opponent, context);
                            return true;
                        },
                        onCancel: () => {
                            context.costs.cancelled = true;
                            return false;
                        },
                        showCancel: this.allowCancel
                    };
                    if (this.allowTopOfDeck && player.deck.length > 0) {
                        promptProps.buttons = [{ text: 'Top of deck', arg: 'topdeck' }];
                        promptProps.onMenuCommand = () => {
                            context.game.actions.discardTopOfDeck().resolve(player, context);
                            return true;
                        };
                    }
                    context.game.promptForSelect(player, promptProps);
                }
            }
        });
    }

    playerCanDiscard(player) {
        return (
            (this.location.includes('hand') && player.canDiscardFromHand) ||
            (this.location.includes('spellboard') && player.spellboard.length > 0) ||
            (this.allowTopOfDeck && player.deck.length > 0)
        );
    }
}

module.exports = ChosenDiscardAction;
