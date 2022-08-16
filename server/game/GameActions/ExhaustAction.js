const CardGameAction = require('./CardGameAction');

class ExhaustAction extends CardGameAction {
    setDefaultProperties() {
        this.showMessage = false;
        this.amount = 1;
    }

    setup() {
        this.name = 'exhaust';
        this.targetType = ['Ally', 'Ready Spell', 'Conjuration', 'Phoenixborn'];
        this.effectMsg = 'exhaust {0}';
    }

    canAffect(card, context) {
        if (!['play area', 'spellboard'].includes(card.location)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardExhausted', { card: card, context: context }, () => {
            card.exhaust(this.amount);
            if (this.showMessage) {
                context.game.addMessage('{0} becomes exhausted', card);
            }
            if (card.isAttacker) {
                context.game.attackState.removeFromBattle(card);
            }
        });
    }
}

module.exports = ExhaustAction;
