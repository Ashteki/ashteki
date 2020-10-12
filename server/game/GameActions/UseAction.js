const CardGameAction = require('./CardGameAction');

class UseAction extends CardGameAction {
    setDefaultProperties() {}

    setup() {
        this.name = 'use';
        this.targetType = ['Ally', 'Conjuration', 'Ready Spell', 'Phoenixborn'];
        this.effectMsg = 'use {0}';
    }

    canAffect(card, context) {
        return (
            card !== context.source &&
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent('onUseCard', { card: card, context: context }, () =>
            card.use(context.player)
        );
    }
}

module.exports = UseAction;
