const CardGameAction = require('./CardGameAction');

class ExhaustGravityFluxAction extends CardGameAction {
    setDefaultProperties() {
        this.showMessage = false;
    }

    setup() {
        this.name = 'exhaust';
        this.targetType = ['Ally', 'Conjuration'];
        this.effectMsg = 'exhaust {0} with a gravity flux token';
    }

    canAffect(card, context) {
        if (!['play area', 'spellboard'].includes(card.location)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardExhausted', { card: card, context: context }, () => {
            card.exhaustGravityFlux();
            if (this.showMessage) {
                context.game.addMessage('{0} becomes exhausted', card);
            }
        });
    }
}

module.exports = ExhaustGravityFluxAction;
