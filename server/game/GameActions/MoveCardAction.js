const { Location } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class MoveCardAction extends CardGameAction {
    setDefaultProperties() {
        this.destination = '';
        this.shuffle = false;
    }

    setup() {
        super.setup();
        this.name = 'move';
        this.effectMsg = 'move {0} to {1}';
        this.effectArgs = () => {
            return this.destination;
        }
    }

    canAffect(card, context) {
        if (
            card.location === 'play area' ||
            card.location === 'spellboard' ||
            !card.controller.getSourceList(this.destination)
        ) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onMoveCard', { card: card, context: context }, () => {
            let origin = card.location;
            context.player.moveCard(card, this.destination);
            if (
                this.shuffle &&
                this.target.findIndex((c) => c === card) === this.target.length - 1
            ) {
                if (this.destination === Location.Deck || origin === Location.Deck) {
                    context.player.shuffleDeck();
                }
            }
        });
    }
}

module.exports = MoveCardAction;
