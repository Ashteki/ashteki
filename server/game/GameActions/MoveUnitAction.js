const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class MoveUnitAction extends CardGameAction {
    setDefaultProperties() {
        this.to = 'right';
    }

    setup() {
        this.name = 'moveUnit';
        this.targetType = BattlefieldTypes;
    }

    canAffect(card, context) {
        if ('play area' !== card.location) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onUnitMoved', { card: card, context: context }, () => {
            card.controller.moveUnit(card, 'right');
        });
    }
}

module.exports = MoveUnitAction;
