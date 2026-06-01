const ActionCost = require('./actioncost');

class ChosenActionCost {
    constructor() {
        this.promptsPlayer = true;
        this.sideCost = new ActionCost({ type: 'side' });
        this.mainCost = new ActionCost({ type: 'main' });
    }

    canPay(context) {
        // if you have either available
        return this.canPayWithMain(context) || this.canPayWithSide(context);
    }

    canPayWithMain(context) {
        return context.player.actions.main && this.mainCost.canPay(context);
    }

    canPayWithSide(context) {
        return context.player.actions.side && this.sideCost.canPay(context);
    }

    resolve(context, result) {
        // if there's no choice
        if (!this.canPayWithMain(context)) {
            context.costs.actionType = 'side';
            return true;
        }
        if (!this.canPayWithSide(context)) {
            context.costs.actionType = 'main';
            return true;
        }
        // or prompt if there's a choice to be made
        let promptPlayer = () => {
            context.game.promptWithHandlerMenu(context.player, {
                choices: ['Main', 'Side', 'Cancel'],
                handlers: [
                    () => (context.costs.actionType = 'main'),
                    () => (context.costs.actionType = 'side'),
                    () => {
                        context.costs.actionType = '';
                        result.cancelled = true;
                    }
                ]
            });
        };

        promptPlayer();
    }

    payEvent(context) {
        switch (context.costs.actionType) {
            case 'main':
                return context.game.actions.spendMainAction().getEvent(context.player, context);
            case 'side':
                return context.game.actions.spendSideAction().getEvent(context.player, context);
        }
        throw new Error(`Cannot determine cost payEvent for ChosenActionCost`);
    }
}

module.exports = ChosenActionCost;
