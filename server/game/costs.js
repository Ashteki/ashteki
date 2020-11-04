const { BattlefieldTypes } = require('../constants');
const Dice = require('./dice');

const Costs = {
    exhaust: () => ({
        canPay: () => true, // cards can be overexhausted (>1 tokens)
        payEvent: (context) => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    exhaustDie: () => ({
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) => context.game.actions.exhaustDie().getEvent(context.source, context)
    }),
    use: () => ({
        canPay: (context) => {
            if (context.source.exhausted) {
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
    play: () => ({
        canPay: (context) => {
            if (
                (context.source.type === 'Ready Spell' && context.player.isSpellboardFull()) ||
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
    chosenDiscard: (amount = 1) => ({
        canPay: (context) => context.player.hand.length > amount,
        payEvent: (context) =>
            context.game.actions.chosenDiscard({ amount: amount }).getEvent(context.player, context)
    }),
    mainAction: () => ({
        canPay: (context) => context.player.actions.main,
        payEvent: (context) =>
            context.game.actions.spendMainAction().getEvent(context.player, context)
    }),
    sideAction: () => ({
        canPay: (context) => context.player.actions.side,
        payEvent: (context) =>
            context.game.actions.spendSideAction().getEvent(context.player, context)
    }),
    die: (props) => ({
        canPay: (context) => {
            // diceCounts.reduce((result, diceCount) => {
            // result &&
            return context.player.dice.some((d) => d.level == props.level && !d.exhausted);
        },
        payEvent: (context) => {
            const die = context.player.dice.find(
                (d) =>
                    d.level == props.level &&
                    !d.exhausted &&
                    (props.level == 'basic' || d.magic == props.magic)
            );
            return context.game.actions.exhaustDie().getEvent(die, context);
        }
    }),
    dice: (diceReq) => {
        return {
            canPay: function (context) {
                return Dice.canMatch(context.player.dice, diceReq);
            },
            resolve: function (context, result) {
                const nonBasics = diceReq.filter((r) => r.level !== 'basic');
                let chosenDice = Dice.matchDice(context.player.dice, nonBasics);
                if (chosenDice.length == diceReq.length) {
                    context.costs.returnDice = chosenDice;
                    return true;
                }
                let promptPlayer = () => {
                    let buttons = [];
                    if (Dice.canMatch(chosenDice, diceReq)) {
                        buttons.push({ text: 'Done', arg: 'done' });
                    }
                    if (result.canCancel) {
                        buttons.push({ text: 'Cancel', arg: 'cancel' });
                    }
                    context.game.promptForDieSelect(context.player, {
                        activePromptTitle: 'Select die',
                        mode: 'match',
                        selectedDice: [...chosenDice],
                        context: context,
                        buttons: buttons,
                        format: diceReq,
                        dieCondition: (d) => !d.exhausted && !chosenDice.includes(d),
                        onSelect: (player, dice) => {
                            // EXACTLY returns an array SINGLE does not
                            chosenDice = chosenDice.concat(dice);
                            if (!Dice.canMatch(chosenDice, diceReq)) {
                                promptPlayer();
                            } else {
                                context.costs.returnDice = chosenDice;
                            }
                            return true;
                        },
                        onMenuCommand: (player, arg) => {
                            if (arg === 'done') {
                                context.costs.returnDice = chosenDice;
                                return true;
                            }
                        },
                        onCancel: () => {
                            context.costs.returnDice = [];
                            result.cancelled = true;
                        }
                    });
                };
                promptPlayer();
            },
            payEvent: (context) =>
                context.game.actions
                    .exhaustDie({ target: context.costs.returnDice })
                    .getEventArray(context),
            promptsPlayer: true
        };
    }
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
                diceReq = diceReq.concat(parseDiceCost(costItem));
        }
    }
    if (diceReq.length > 0) {
        costs.push(Costs.dice(diceReq));
    }

    return costs;
}

function parseDiceCost(diceCost) {
    // examples:
    // "1 [[charm:class]]",
    // "1 [[basic]]"
    // "# [[type||missing:level]]"
    const parts = diceCost.split(' ');
    const count = parts[0];
    const definition = parts[1].replace('[[', '').replace(']]', '').split(':');
    const level = definition.length > 1 ? definition[1] : definition[0];
    const magic = definition.length > 1 ? definition[0] : null;
    const result = [];
    for (let i = 1; i <= count; i++) {
        result.push({ magic: magic, level: level });
    }
    return result;
}

module.exports = { Costs, parseCosts, parseDiceCost };
