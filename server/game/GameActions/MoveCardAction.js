const { ContextReplacementPlugin } = require('webpack');
const { Location } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class MoveCardAction extends CardGameAction {
    setDefaultProperties() {
        this.destination = '';
        this.shuffle = false;
        this.showMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'move';
        this.effectMsg = 'move {0} to {1}';
        this.effectArgs = () => {
            return this.destination;
        };
    }

    canAffect(card, context) {
        if (
            // 5H4Z: I don't know why move card tried not to affect play area or spellboard
            /*card.location === 'play area' || 
            card.location === 'spellboard' ||*/
            !card.controller.getSourceList(this.destination)
        ) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            'onMoveCard',
            { card: card, context: context, showMessage: this.showMessage },
            () => {
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

                if (this.showMessage) {
                    context.game.addMessage(
                        '{0} moves {1} to their {2}',
                        context.player,
                        card,
                        this.destination
                    );
                }
            }
        );
    }
}

module.exports = MoveCardAction;
