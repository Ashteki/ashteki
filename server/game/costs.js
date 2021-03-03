const { BattlefieldTypes } = require('../constants');
const ActionCost = require('./Costs/actioncost');
const ChosenActionCost = require('./Costs/chosenactionscost');
const DiceCost = require('./Costs/dicecost');
const DynamicDiceCost = require('./Costs/dynamicdicecost');
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
        canPay: (context) => context.player.cardsInPlay.includes(context.source),
        payEvent: (context) => context.game.actions.destroy().getEvent(context.source, context)
    }),
    exhaustDie: () => ({
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) => context.game.actions.exhaustDie().getEvent(context.source, context)
    }),
    use: () => ({
        // exhausted game objects can't be used
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) =>
            context.game.getEvent('unnamedEvent', {}, () => {
                return true;
            })
    }),
    play: () => ({
        // is this card playable, are there limits on the target location
        canPay: (context) => {
            if (
                (context.source.type === 'Ready Spell' &&
                    context.player.isSpellboardFull(context.source.name)) ||
                (BattlefieldTypes.includes(context.source.getType()) &&
                    context.player.isBattlefieldFull())
            ) {
                return false;
            } else {
                return true;
            }
        },
        payEvent: (context) =>
            context.game.getEvent('unnamedEvent', {}, () => {
                return true;
            })
    }),
    loseStatus: (amount = 1) => ({
        canPay: (context) => context.source.status >= amount,
        payEvent: (context) =>
            context.game.actions.removeStatus({ amount: amount }).getEvent(context.source, context)
    }),
    // player chooses their own card to discard from hand
    chosenDiscard: (amount = 1) => ({
        canPay: (context) => context.player.hand.length >= amount,
        payEvent: (context) =>
            context.game.actions.chosenDiscard({ amount: amount }).getEvent(context.player, context)
    }),
    dice: (cost) => new DiceCost({ diceReq: cost }),
    dynamicDice: (costFunc) => new DynamicDiceCost(costFunc)
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
        costs.push(Costs.dice(diceReq));
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
    const count = parseInt(parts[0]);
    const definition = parts[1].replace('[[', '').replace(']]', '').split(':');
    const level = definition.length > 1 ? definition[1] : definition[0];
    const magic = definition.length > 1 ? definition[0] : null;

    return new DiceCount(count, level, magic);
}

module.exports = { Costs, parseCosts, parseDiceCost };
