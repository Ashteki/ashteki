const PlayerAction = require('./PlayerAction');

class RearrangeCardsAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 3;
        this.purge = 0;
        this.remainingCards = [];
        this.purgeCards = [];
        this.purgeType = 'purge';
    }

    setup() {
        super.setup();
        this.name = 'rearrangeDeck';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return this.amount && player.deck.length > 0 && super.canAffect(player, context);
    }

    promptForRemainingCards(context) {
        const purgeText =
            this.purgeType === 'bottom'
                ? 'Select a card to remove from the game'
                : 'select a card to move to the bottom of the deck';

        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: !this.allPurged()
                ? purgeText
                : 'Select the next card to return (last one is top)',
            context: context,
            cards: this.remainingCards,
            cardHandler: (card) => {
                if (!this.allPurged()) {
                    this.purgeCards.push(card);
                } else {
                    this.orderedCards.unshift(card);
                }
                this.remainingCards = this.remainingCards.filter((c) => c !== card);

                if (this.remainingCards.length === 1) {
                    this.orderedCards.unshift(this.remainingCards[0]);
                } else {
                    this.promptForRemainingCards(context);
                }
            }
        });
    }

    allPurged() {
        return this.purgeCards.length >= this.purge;
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        let player = this.target[0];
        this.amount = Math.min(this.amount, player.deck.length);
        this.orderedCards = this.amount === 1 ? player.deck.slice(0, 1) : [];
        this.remainingCards = player.deck.slice(0, this.amount);

        context.game.addMessage('{0} reveals {1}', player, this.remainingCards);
        if (this.amount > 1) {
            this.promptForRemainingCards(context);
        }
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            {
                player: player,
                cards: this.orderedCards,
                purgeCards: this.purgeCards,
                context: context
            },
            (event) => {
                if (this.purgeType === 'bottom') {
                    player.deck.unshift(...this.purgeCards);

                    context.game.addMessage(
                        '{0} returns {1} to the bottom of the deck',
                        context.player,
                        event.purgeCards
                    );
                } else {
                    context.game.actions.purge().resolve(event.purgeCards, context);
                    context.game.addMessage(
                        '{0} removes {1} from the game',
                        context.player,
                        event.purgeCards
                    );
                }

                player.deck.splice(0, this.amount, ...this.orderedCards);
                context.game.addMessage(
                    'Remaining cards are returned as ordered to the top of the deck'
                );
            }
        );
    }
}

module.exports = RearrangeCardsAction;
