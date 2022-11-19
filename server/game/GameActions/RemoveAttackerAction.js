const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class RemoveAttackerAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.effectMsg = '{0} is removed from the battle';
    }

    setup() {
        this.targetType = BattlefieldTypes;
    }

    canAffect(card, context) {
        return (
            card.isAttacker &&
            context.game.attackState &&
            context.game.attackState.involvesCard(card)
        );
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, (event) => {
            event.context.defender = context.game.attackState.removeAttacker(card, null);
        });
    }
}

module.exports = RemoveAttackerAction;
