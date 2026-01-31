const GameAction = require('./GameAction');

class PreventDamageAction extends GameAction {
    setDefaultProperties() {
        this.event = null;
    }

    hasLegalTarget(context) {
        this.update(context);
        return !!this.event;
    }

    getEventArray(context) {
        let properties = this.propertyFactory(context);
        if (!properties.event.preventable) {
            return [];
        }
        return [
            super.createEvent(
                'onDamagePrevented',
                { context: context, card: this.event.card },
                (event) => {
                    const amt =
                        properties.amount === 'all' ? properties.event.amount : properties.amount;
                    properties.event.amount = properties.event.amount - amt;
                    event.amountPrevented = amt;

                    context.game.addMessage(
                        '{0} prevents {1} damage to {2}',
                        context.ability.title || context.source,
                        amt,
                        event.card
                    );
                })
        ];
    }
}

module.exports = PreventDamageAction;
