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
        return properties.event.preventable
            ? [
                super.createEvent('onDamagePrevented', { context: context }, (event) => {
                    const amt =
                        properties.amount === 'all' ? properties.event.amount : properties.amount;
                    properties.event.amount = properties.event.amount - amt;
                    event.amountPrevented = amt;

                    context.game.addMessage('{0} prevents damage to {1}', 'preventer', context.source);
                })
            ]
            : [];
    }
}

module.exports = PreventDamageAction;
