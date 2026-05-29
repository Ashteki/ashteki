class ChosenOptionCost {
    constructor(options = []) {
        // options to be an array of {text: '', costs: []} objects
        this.promptsPlayer = true;
        this.options = options;
    }

    canPay(context) {
        // if you have either available
        return this.options.some((o) => o.costs.every((c) => c.canPay(context)));
    }

    resolve(context, result) {
        // if there's no choice
        if (this.options.filter((o) => o.costs.every((c) => c.canPay(context))).length === 1) {
            context.chosenCost = this.options.find((o) => o.costs.every((c) => c.canPay(context, result))).costs;
            context.chosenCost.forEach((c) => c.resolve && c.resolve(context));
            return true;
        }

        // or prompt if there's a choice to be made
        let promptPlayer = () => {
            context.game.promptWithHandlerMenu(context.player, {
                choices: this.options.map((o) => o.text),
                handlers: this.options.map((o) => () => {
                    context.chosenCost = o.costs;
                    context.chosenCost.forEach((c) => c.resolve && c.resolve(context, result))
                })
                // choiceHandler: (choice) => {
                //     context.chosenCost = this.choice.costs;
                //     context.chosenCost.forEach((c) => c.resolve(context));
                // }
            });
        };

        promptPlayer();
    }

    payEvent(context) {
        const wrapper = context.game.getEvent('unnamedEvent', { player: context.player });
        context.chosenCost.forEach((cost) => {
            if (cost.payEvent) {
                wrapper.addChildEvent(cost.payEvent(context));
            }
        });
        return wrapper;
    }
}

module.exports = ChosenOptionCost;
