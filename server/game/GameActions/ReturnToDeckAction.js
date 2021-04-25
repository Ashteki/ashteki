const { ConjuredCardTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = true;
        this.chooseTopBottom = false;
        this.reveal = true;
    }

    setup() {
        super.setup();
        this.name = 'returnToDeck';
        if (this.shuffle) {
            this.effectMsg = this.reveal
                ? 'shuffle {0} back into their deck'
                : 'shuffle a card back into their deck';
        } else {
            this.effectMsg =
                (this.reveal ? 'return {0} to the ' : 'return a card to the ') +
                (this.bottom ? 'bottom' : 'top') +
                ' of their deck';
        }
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        if (this.chooseTopBottom) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose how to return the card',
                context: context,
                choices: ['Top', 'Bottom'],
                handlers: [() => (this.bottom = false), () => (this.bottom = true)]
            });
        }
    }

    getEvent(card, context) {
        let eventName =
            card.location === 'play area' || card.location === 'spellboard'
                ? 'onCardLeavesPlay'
                : 'onMoveCard';

        let destinationPile = ConjuredCardTypes.includes(card.type) ? 'archives' : 'deck';

        let deckLength = card.owner.getSourceList(destinationPile).length;

        return super.createEvent(
            eventName,
            { card: card, context: context, deckLength: deckLength },
            (event) => {
                const message = this.shuffle
                    ? '{0} shuffles a card back into their deck'
                    : (this.reveal
                        ? '{0} returns {1} to the {2} of their deck'
                        : '{0} returns a card to the {2} of their deck');
                const dest = this.bottom ? 'bottom' : 'top';
                event.context.game.addMessage(message, event.context.player, event.card, dest);
                card.owner.moveCard(card, destinationPile, { bottom: this.bottom });
                let cardsByOwner = this.target.filter((c) => c.owner === card.owner);
                if (
                    this.shuffle &&
                    cardsByOwner.findIndex((c) => c === card) === cardsByOwner.length - 1
                ) {
                    card.owner.shuffleDeck();
                }
            }
        );
    }
}

module.exports = ReturnToDeckAction;
