const { Location } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class RevealAspectAction extends CardGameAction {
    setDefaultProperties() {
        this.showMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal {0}';
    }

    canAffect(card, context) {
        return card.location === Location.PlayArea && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardEntersPlay', { card, context }, (event) => {
            event.card.facedown = false;
            if (this.showMessage) {
                context.game.addMessage('{0} puts {1} into play', card.owner, card);
            }
        });
    }
}

module.exports = RevealAspectAction;
