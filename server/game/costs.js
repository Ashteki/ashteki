const ActionCost = require('./Costs/actioncost');
const ChosenActionCost = require('./Costs/chosenactionscost');
const ChosenDieOrDiscardCost = require('./Costs/chosendieordiscardcost');
const ChosenDiscardCost = require('./Costs/chosendiscardcost');
const DiceCost = require('./Costs/dicecost');
const DynamicDiceCost = require('./Costs/dynamicdicecost');
const XDiceCost = require('./Costs/xdicecost');
const DiceCount = require('./DiceCount');

const Costs = {
    mainAction: () => new ActionCost({ type: 'main' }),
    sideAction: () => new ActionCost({ type: 'side' }),
    chosenAction: () => new ChosenActionCost(),
    exhaust: () => ({
        canPay: () => true, // cards can be overexhausted (>1 tokens)
        payEvent: (context) => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    destroy: () => ({
        canPay: (context) => context.player.unitsInPlay.includes(context.source),
        payEvent: (context) => context.game.actions.destroy().getEvent(context.source, context)
    }),
    // this is the cost to execute a dice power - not to spend the dice (see diceCost)
    exhaustDie: () => ({
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) => {
            const event = context.game.getEvent('onDiePowerSpent', {
                die: context.source,
                player: context.player
            });
            event.addSubEvent(context.game.actions.exhaustDie().getEvent(context.source, context));
            return event;
        }
    }),
    use: () => ({
        // exhausted game objects can't be used
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) =>
            context.game.getEvent('useCardEvent', {}, () => {
                context.game.cardUsed(context.source, context.player);
                return true;
            })
    }),
    loseStatus: (amount = 1) => ({
        canPay: (context) => context.source.status >= amount,
        payEvent: (context) => {
            const event = context.game.getEvent('onLoseStatusCost', {
                amount: amount,
                card: context.source
            });
            event.addSubEvent(
                context.game.actions
                    .removeStatus({ amount: amount })
                    .getEvent(context.source, context)
            );
            return event;
        }
    }),
    loseAllStatus: () => ({
        canPay: (context) => context.source.status >= 0,
        payEvent: (context) => {
            context.costs.statusPaid = context.source.status;
            return context.game.actions.removeStatus({ all: true }).getEvent(context.source, context);
        }
    }),
    // player chooses their own card to discard from hand
    chosenDiscard: (amount = 1, allowCancel = false) => new ChosenDiscardCost({ amount, allowCancel }),
    dice: (cost, title) => new DiceCost({ diceReq: cost, title: title }),
    xDice: (cost, title) => new XDiceCost({ diceReq: cost, title: title }),
    dynamicDice: (costFunc) => new DynamicDiceCost(costFunc),
    chosenDieOrDiscard: () => new ChosenDieOrDiscardCost()
};

function parseCosts(costData) {
    const costs = [];
    let diceReq = [];
    for (let costItem of costData) {
        switch (costItem) {
            case '[[main]]':
                costs.push(Costs.mainAction());
                break;
            case '[[side]]':
                costs.push(Costs.sideAction());
                break;
            case '[[exhaust]]':
                costs.push(Costs.exhaust());
                break;
            default:
                if (costItem.indexOf('[[discard]]') > -1) {
                    costs.push(Costs.chosenDiscard());
                    break;
                }
                if (Array.isArray(costItem)) {
                    // this is a parallel cost
                    if (costItem.includes('[[main]]')) {
                        //ASSUMPTION: this is a parallel action cost
                        // and will always include main as an option
                        costs.push(Costs.chosenAction());
                        break;
                    }
                }
                // normal dice cost or parallel dice cost
                diceReq = diceReq.concat(parseDiceCost(costItem));
        }
    }
    if (diceReq.length > 0) {
        if (diceReq[0].count === null) {
            costs.push(Costs.xDice(diceReq));
        } else {
            costs.push(Costs.dice(diceReq));
        }
    }

    return costs;
}

function parseDiceCost(diceCost) {
    if (Array.isArray(diceCost)) {
        const mappedCosts = diceCost.map((dc) => parseDiceCost(dc));
        return [mappedCosts];
    }
    // examples:
    // "1 [[charm:class]]",
    // "1 [[basic]]"
    // "# [[type||missing:level]]"
    const parts = diceCost.split(' ');
    const count = isNaN(parts[0]) ? null : parseInt(parts[0]);
    const definition = parts[1].replace('[[', '').replace(']]', '').split(':');
    const level = definition.length > 1 ? definition[1] : definition[0];
    const magic = definition.length > 1 ? definition[0] : null;

    return new DiceCount(count, level, magic);
}

module.exports = { Costs, parseCosts, parseDiceCost };
