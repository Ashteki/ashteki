const Dice = require('./dice');

const Costs = {
    exhaust: () => ({
        canPay: () => true, // cards can be overexhausted (>1 tokens)
        payEvent: (context) => context.game.actions.exhaust().getEvent(context.source, context)
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
                ((context.source.type === 'Ally' || context.source.type === 'Conjuration') &&
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
            context.game.actions.loseStatus({ amount: amount }).getEvent(context.source, context)
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
    dice: function (diceReq) {
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
                        mode: 'exactly',
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

module.exports = Costs;
