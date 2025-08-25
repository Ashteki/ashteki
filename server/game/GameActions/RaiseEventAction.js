const { card } = require('../Effects/EffectBuilder');
const GameAction = require('./GameAction');

class RaiseEventAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.snapshot = false;
        this.cardCondition = () => true;
    }

    hasLegalTarget() {
        return true;
    }

    getEventArray(context) {
        return [
            super.createEvent('onRoundEnded', {
                lopsided: true,
                snapshot: this.snapshot,
                cardCondition: this.cardCondition
            })
        ];
    }
}

module.exports = RaiseEventAction;
