const PlayerAction = require('./PlayerAction');

class ChosenUnexhaustAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.cardType = 'any';
        this.unique = true; // choose a single of each (by name)
        // this.activePromptTitle = 'Choose a card to remove an exhaustion token from';
    }

    setup() {
        super.setup();
        this.name = 'unexhaust';
        this.effectMsg = 'unexhaust ' + this.amount + ' cards';
        this.cards = [];
    }

    preEventHandler(context) {
        if (this.amount > 0) {
            this.promptForRemainingCards(context);
        }
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player }, () => {
            context.game.actions.removeExhaustion().resolve(this.cards, context);
            context.game.addMessage('{0} removes an exhaustion token from {1}', player, this.cards);
        });
    }

    promptForRemainingCards(context) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: this.activePromptTitle,
            mode: 'exactly',
            numCards: this.amount,
            context: context,
            cardType: this.cardType,
            unique: true,
            cardCondition: (card) => {
                return (
                    // card is exhausted
                    card.exhausted
                );
            },
            controller: context.player === context.player ? 'self' : 'opponent',
            onSelect: (player, cards) => {
                this.cards = cards;
                return true;
            }
        });
    }
}

module.exports = ChosenUnexhaustAction;
