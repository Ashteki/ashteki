class ChosenActionCost {
    constructor() {
        this.promptsPlayer = true;
    }

    canPay(context) {
        // if you have either available
        return context.player.actions.main || context.player.actions.side;
    }

    resolve(context, result) {
        // if there's no choice
        if (!context.player.actions.main) {
            context.costs.actionType = 'side';
            return true;
        }
        if (!context.player.actions.side) {
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
