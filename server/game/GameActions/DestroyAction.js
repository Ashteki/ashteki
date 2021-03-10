const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.damageEvent = null;
    }

    setup() {
        this.targetType = ['Ally', 'Conjuration'];
    }

    canAffect(card, context) {
        return !card.moribund && card.location === 'play area' && super.canAffect(card, context);
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
            damageEvent: this.damageEvent
        };
        return super.createEvent('onCardDestroyed', params, (event) => {
            event.context.game.addMessage('{0} is destroyed', card);
            event.card.moribund = true;

            event.leavesPlayEvent = context.game.getEvent(
                'onCardLeavesPlay',
                {
                    card: event.card,
                    context: context,
                    condition: (event) => event.card.location === 'play area',
                    triggeringEvent: event,
                    battlelineIndex: event.card.controller.unitsInPlay.indexOf(event.card) - 1
                },
                (leavesPlayEvent) => {
                    leavesPlayEvent.card.owner.moveCard(
                        event.card,
                        event.card.type == 'Conjuration' ? 'archives' : 'discard'
                    );
                }
            );

            event.addSubEvent(event.leavesPlayEvent);
        });
    }
}

module.exports = DestroyAction;
