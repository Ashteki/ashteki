const GameAction = require('./GameAction');

class RaiseEventAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
    }

    hasLegalTarget() {
        return true;
    }

    getEventArray(context) {
        return [super.createEvent('onRoundEnded', { lopsided: true })];
    }
}

module.exports = RaiseEventAction;
