class ActionCost {
    constructor(properties) {
        this.actionType = properties.type;
    }

    canPay(context) {
        return (
            context.player.actions[this.actionType] &&
            (this.actionType !== 'main' || context.player.checkRestrictions('spendMain', context))
        );
    }

    payEvent(context) {
        const action =
            this.actionType === 'main'
                ? context.game.actions.spendMainAction()
                : context.game.actions.spendSideAction();
        return action.getEvent(context.player, context);
    }
}

module.exports = ActionCost;
