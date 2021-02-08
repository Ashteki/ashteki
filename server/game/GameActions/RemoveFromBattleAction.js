const CardGameAction = require('./CardGameAction');

class RemoveFromBattleAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.effectMsg = '{0} is removed from the battle';
    }

    setup() {
        this.targetType = ['Ally', 'Conjuration'];
    }

    canAffect(card, context) {
        return context.game.attackState.involvesCard(card);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.game.attackState.removeFromBattle(card);
        });
    }
}

module.exports = RemoveFromBattleAction;
