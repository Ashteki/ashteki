const CardGameAction = require('./CardGameAction');

class PlaceUnderAction extends CardGameAction {
    setDefaultProperties() {
        this.facedown = false;
        this.parent = null;
    }

    setup() {
        super.setup();
        this.name = 'placeUnder';
        this.effectArgs = this.parent;
        this.effectMsg = 'place ' + (this.facedown ? 'a card' : '{0}') + ' under {1}';
    }

    canAffect(card, context) {
        return this.parent && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onPlaceUnder', { card, context, parent: this.parent }, (event) => {
            card.owner.placeCardUnder(card, event.parent);
        });
    }
}

module.exports = PlaceUnderAction;
