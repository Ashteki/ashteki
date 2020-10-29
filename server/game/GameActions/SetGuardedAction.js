const CardGameAction = require('./CardGameAction');

class SetGuardedAction extends CardGameAction {
    setup() {
        this.name = 'exhaust';
        this.targetType = ['Phoenixborn'];
        this.effectMsg = 'exhaust {0}';
    }

    canAffect(card, context) {
        if (!['play area', 'spellboard'].includes(card.location)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return super.checkEventCondition(event);
    }

    getEvent(card, context) {
        return super.createEvent(
            'onPhoenixbornGuarded',
            { card: card, context: context },
            () => (card.usedGuardThisRound = true)
        );
    }
}

module.exports = SetGuardedAction;
