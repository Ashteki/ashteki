const { Level } = require('../../constants');
const DiceCount = require('../DiceCount');
const ChosenDiscardCost = require('./chosendiscardcost');
const DiceCost = require('./dicecost');

class ChosenDieOrDiscardCost {
    constructor() {
        this.promptsPlayer = true;
        this.dieCost = new DiceCost({
            diceReq: [new DiceCount(1, Level.Basic)]
        });
        this.discardCost = new ChosenDiscardCost({ amount: 1 });
    }

    canPay(context) {
        // if you have either available
        return this.canPayWithBasicDie(context) || this.canPayWithDiscard(context);
    }

    canPayWithBasicDie(context) {
        return this.dieCost.canPay(context);
    }

    canPayWithDiscard(context) {
        return this.discardCost.canPay(context);
    }

    resolve(context, result) {
        // if there's no choice
        if (!this.canPayWithBasicDie(context)) {
            context.costs.dieOrDiscard = 'discard';
            return true;
        }
        if (!this.canPayWithDiscard(context)) {
            context.costs.dieOrDiscard = 'die';
            this.dieCost.resolve(context, result);

            return true;
        }
        // or prompt if there's a choice to be made
        let promptPlayer = () => {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Pay with dice or discard?',
                choices: ['Basic Die', 'Discard', 'Cancel'],
                handlers: [
                    () => {
                        context.costs.dieOrDiscard = 'die';
                        this.dieCost.resolve(context, result);
                    },
                    () => {
                        context.costs.dieOrDiscard = 'discard';
                        this.discardCost.resolve(context, result);
                    },
                    () => {
                        context.costs.dieOrDiscard = '';
                        result.cancelled = true;
                    }
                ]
            });
        };

        promptPlayer();
    }

    payEvent(context) {
        switch (context.costs.dieOrDiscard) {
            case 'die':
                return this.dieCost.payEvent(context);
            case 'discard':
                return this.discardCost.payEvent(context);
        }
        throw new Error(`Cannot determine cost payEvent for Chosen die or discard cost`);
    }
}

module.exports = ChosenDieOrDiscardCost;
