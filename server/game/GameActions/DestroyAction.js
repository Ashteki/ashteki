const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.damageEvent = null;
        this.tokenEvent = null;
        this.purge = false;
    }

    setup() {
        this.targetType = ['Ally', 'Conjuration'];
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return (
            // removing canAffect check here otherwise ondestroy reactions never trigger e.g. with undying heart
            event.card.checkRestrictions(this.name, event.context)
        );
    }

    getEvent(card, context) {
        card.moribund = true;
        const params = {
            card: card,
            context: context,
            damageEvent: this.damageEvent,
            tokenEvent: this.tokenEvent,
            purge: this.purge
        };
        return super.createEvent('onCardDestroyed', params, (event) => {
            const newDestination =
                event.card.type == 'Conjuration' ? 'archives' : event.purge ? 'purged' : 'discard';

            let message = '{0} is destroyed';
            if (event.purge) {
                message = message + ', and removed from the game';
            }
            event.context.game.addMessage(message, card);
            event.card.moribund = true;
            event.card.skipDestroyCheck = false;
            if (event.card.isAttacker || event.card.isDefender) {
                context.game.attackState.removeFromBattle(
                    event.card,
                    false,
                    event.damageEvent && event.damageEvent.context.source
                );
            }

            event.leavesPlayEvent = context.game.getEvent(
                'onCardLeavesPlay',
                {
                    card: event.card,
                    context: context,
                    condition: (event) => event.card.location === 'play area',
                    triggeringEvent: event,
                    destination: newDestination
                },
                (leavesPlayEvent) => {
                    leavesPlayEvent.card.owner.moveCard(event.card, leavesPlayEvent.destination);
                }
            );

            event.addSubEvent(event.leavesPlayEvent);
        });
    }
}

module.exports = DestroyAction;
