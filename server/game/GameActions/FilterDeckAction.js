const PlayerAction = require('./PlayerAction');

class FilterDeckAction extends PlayerAction {
    constructor(propertyFactory) {
        super(propertyFactory);
    }

    setup() {
        super.setup();
        this.name = 'filterDeck';
    }

    setDefaultProperties() {
        this.amount = 3;
        this.reveal = false;
        this.remainingCards = [];
        this.orderedCards = [];
        this.bottomCards = [];
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return this.amount && player.deck.length > 0 && super.canAffect(player, context);
    }

    promptForTopOrBottom(card, context) {
        // fudge a copy of the card to display despite location being 
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Return ' + card.name + ' to the top or bottom of your deck?',
            source: 'Return a card',
            controls: [
                {
                    type: 'targeting',
                    source: card.getShortSummary(),
                    forceReveal: true,
                    targets: []
                }
            ],
            choices: ['Top', 'Bottom'],
            choiceHandler: (key) => {
                if (key.toLowerCase() === 'bottom') {
                    this.bottomCards.push(card);
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

    promptForRemainingCards(context) {
        if (this.remainingCards.length === 1) {
            this.promptForTopOrBottom(this.remainingCards[0], context);
            return;
        }

        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose a card return to the deck',
            context: context,
            cards: this.remainingCards,
            cardHandler: (card) => {
                this.promptForTopOrBottom(card, context);
            }
        });
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        let player = this.target[0];
        this.amount = Math.min(this.amount, player.deck.length);

        this.remainingCards = player.deck.slice(0, this.amount);
        if (this.remainingCards.length > 0) {
            context.game.addMessage(
                "{0} uses {1} to look at the top {2} cards of {3}'s deck",
                context.player,
                context.source,
                this.amount,
                player
            );

            this.promptForRemainingCards(context);
        }
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            {
                player: player,
                bottomCards: this.bottomCards,
                topCards: this.orderedCards,
                context: context
            },
            (event) => {
                if (event.bottomCards.length > 0) {
                    event.bottomCards.forEach((c) => {
                        event.player.moveToBottom(c);
                    });

                    const bottomMessage = '{0} returns {1} cards to the bottom of the deck';
                    context.game.addMessage(bottomMessage, context.player, event.bottomCards.length);
                }
                if (event.topCards.length > 0) {
                    const topMessage = '{0} returns {1} cards to the top of the deck';
                    context.game.addMessage(topMessage, context.player, event.topCards.length);
                }

                event.player.deck.splice(0, event.topCards.length, ...event.topCards);
            }
        );
    }
}

module.exports = FilterDeckAction;
