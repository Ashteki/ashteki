const { ConjuredCardTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = true;
        this.chooseTopBottom = false;
    }

    setup() {
        super.setup();
        this.name = 'returnToDeck';
        if (this.shuffle) {
            this.effectMsg = 'shuffle {0} back into their deck';
        } else {
            this.effectMsg =
                'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + ' of their deck';
        }
    }

    preEventHandler(context) {
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
            () => {
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
