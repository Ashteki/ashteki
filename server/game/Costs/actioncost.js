class ActionCost {
    constructor(properties) {
        this.actionType = properties.type;
    }

    canPay(context) {
        if (this.actionType === 'side' && !context.player.checkRestrictions('spendSide')) {
            return false;
        }

        return (
            !!context.player.actions[this.actionType] &&
            (this.actionType !== 'main' ||
                !(context.player.anyEffect('mustAttack') && context.player.canAttack()))
        );
    }

    payEvent(context) {
        const action =
            this.actionType === 'main'
                ? context.game.actions.spendMainAction()
                : context.game.actions.spendSideAction();

        if (!context.costs.actions) {
            context.costs.actions = {};
        }
        if (this.actionType === 'main') {
            context.costs.actions.main = true;

        } else {
            context.costs.actions.side = true;
        }

        return action.getEvent(context.player, context);
    }
}

module.exports = ActionCost;
