class ActionCost {
    constructor(properties) {
        this.actionType = properties.type;
    }

    canPay(context) {
        // using this to track costs for display - could use for checking restrictions later
        if (this.actionType === 'reaction') {
            return true;
        }

        if (this.actionType === 'side' && !context.player.checkRestrictions('spendSide')) {
            return false;
        }

        return (
            !!context.player.actions[this.actionType] &&
            (this.actionType !== 'main' ||
                !(context.player.anyEffect('mustAttack') && context.player.canAttack()))
        );
    }

    resolve(context, result) {
        if (this.actionType === 'side' && !context.player.checkRestrictions('spendSide')) {
            context.game.addMessage('{0} cannot take a side action', context.player);
            result.cancelled = true;
            return false;
        }
    }

    payEvent(context) {
        if (!context.costs.actions) {
            context.costs.actions = {};
        }

        if (this.actionType === 'reaction') {
            context.costs.actions.reaction = true;
            return context.game.getEvent('unnamedEvent', {}, () => {
                return true;
            });
        }

        if (this.actionType === 'main') {
            context.costs.actions.main = true;
        } else {
            context.costs.actions.side = true;
        }

        const action =
            this.actionType === 'main'
                ? context.game.actions.spendMainAction()
                : context.game.actions.spendSideAction();

        return action.getEvent(context.player, context);
    }
}

module.exports = ActionCost;
