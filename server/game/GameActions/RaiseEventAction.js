const GameAction = require('./GameAction');

class RaiseEventAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.snapshot = false;
    }

    hasLegalTarget() {
        return true;
    }

    getEventArray(context) {
        return [super.createEvent('onRoundEnded', { lopsided: true, snapshot: this.snapshot })];
    }
}

module.exports = RaiseEventAction;
