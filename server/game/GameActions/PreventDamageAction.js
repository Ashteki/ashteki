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
        return context.event.preventable
            ? [
                  super.createEvent('unnamedEvent', {}, () => {
                      let properties = this.propertyFactory(context);
                      const amt =
                          properties.amount === 'all' ? properties.event.amount : properties.amount;
                      properties.event.amount = properties.event.amount - amt;
                  })
              ]
            : [];
    }
}

module.exports = PreventDamageAction;
