const CardGameAction = require('./CardGameAction');

class ReadyAction extends CardGameAction {
    setup() {
        this.name = 'ready';
        this.targetType = ['Ally', 'Ready Spell', 'Conjuration', 'Phoenixborn'];
        this.effectMsg = 'ready {0}';
    }

    canAffect(card, context) {
        return (
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent('onCardReadied', { card: card, context: context }, () =>
            card.ready()
        );
    }
}

module.exports = ReadyAction;
