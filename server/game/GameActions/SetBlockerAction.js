const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class SetBlockerAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.attacker = null;
        this.effectMsg = '{0} is removed from the battle';
        this.forceRemoval = false;
    }

    setup() {
        this.targetType = BattlefieldTypes;
    }

    canAffect(card, context) {
        return context.game.attackState && !context.game.attackState.involvesCard(card);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.game.attackState.setBlockerForAttacker(card, this.attacker);
        });
    }
}

module.exports = SetBlockerAction;
