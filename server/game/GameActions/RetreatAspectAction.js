const CardGameAction = require('./CardGameAction');

class RetreatAspectAction extends CardGameAction {
    setDefaultProperties() {
        this.location = ['play area'];
        this.showMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'retreatAspect';
        this.effectMsg = 'return {0} to its threat area';

        if (!Array.isArray(this.location)) {
            this.location = [this.location];
        }
    }

    canAffect(card, context) {
        if (!this.location.includes(card.location)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            'onAspectRetreat',
            { card: card, player: card.owner, context: context },
            (event) => {
                event.player.returnCardToThreatZone(event.card);
                if (this.showMessage) {
                    context.game.addMessage(
                        "{0} is returned to {1}'s threat zone",
                        event.card,
                        event.player
                    );
                }
            }
        );
    }
}

module.exports = RetreatAspectAction;
