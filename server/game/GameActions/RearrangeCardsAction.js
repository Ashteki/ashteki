const PlayerAction = require('./PlayerAction');

class RearrangeCardsAction extends PlayerAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.name = 'rearrangeDeck';
        this.remainingCards = [];
        this.purgeCards = [];
    }

    setDefaultProperties() {
        this.amount = 3;
        this.purge = 0;
        this.purgeType = 'purge';
        this.reveal = false;
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
                ? 'Choose a card to move to the bottom of the deck'
                : 'Choose a card to remove from the game';

        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: !this.allPurged()
                ? purgeText
                : 'Choose a card to place on top of the deck',
            context: context,
            cards: this.remainingCards,
            cardHandler: (card) => {
                if (!this.allPurged()) {
                    this.purgeCards.push(card);
                } else {
                    this.orderedCards.unshift(card);
                }
                this.remainingCards = this.remainingCards.filter((c) => c !== card);

                if (this.remainingCards.length > 0) {
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
        context.game.addMessage(
            "{0} uses {1} to look at the top {2} cards of {3}'s deck",
            context.player,
            context.source,
            this.amount,
            player
        );
        if (this.reveal) {
            context.game.addMessage('{0} reveals {1}', player, this.remainingCards);
        }
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
                if (this.purge > 0) {
                    const subject = this.reveal ? '{1} ' : 'a card ';
                    if (this.purgeType === 'bottom') {
                        player.deck.push(...this.purgeCards);
                        const bottomMessage = '{0} returns ' + subject + 'to the bottom of the deck';
                        context.game.addMessage(bottomMessage, context.player, event.purgeCards);
                    } else {
                        context.game.actions.purge().resolve(event.purgeCards, context);
                        const purgeMessage = '{0} removes ' + subject + 'from the game';
                        context.game.addMessage(purgeMessage, context.player, event.purgeCards);
                    }
                    context.game.addMessage(
                        'Remaining cards return in chosen order to the top of the deck'
                    );
                } else {
                    context.game.addMessage(
                        'All cards return in chosen order to the top of the deck'
                    );
                }
                player.deck.splice(0, this.amount, ...this.orderedCards);
            }
        );
    }
}

module.exports = RearrangeCardsAction;
