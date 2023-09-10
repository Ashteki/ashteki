const { BattlefieldTypes, PhoenixbornTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

// readyAction is used to unexhaust during the recovery phase
class ReadyAction extends CardGameAction {
    setup() {
        this.name = 'ready';
        this.targetType = [
            ...BattlefieldTypes,
            ...PhoenixbornTypes,
            'Alteration Spell',
            'Ready Spell'
        ];
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
