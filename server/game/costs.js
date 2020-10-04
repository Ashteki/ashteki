const Costs = {
    exhaust: () => ({
        canPay: (context) => !context.source.exhausted,
        payEvent: (context) => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    use: () => ({
        canPay: (context) => {
            if (
                // keyforge rule of 6 - does this map to ashes at all?
                context.game.cardsUsed
                    .concat(context.game.cardsPlayed)
                    .filter((card) => card.name === context.source.name).length >= 6
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
    play: () => ({
        canPay: (context) => {
            if (
                // keyforge rule of 6 - does this map to ashes at all?
                context.game.cardsUsed
                    .concat(context.game.cardsPlayed)
                    .filter((card) => card.name === context.source.name).length >= 6
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
    payAmber: (amount = 1) => ({
        canPay: (context) => context.player.amber >= amount,
        payEvent: (context) => {
            let action = context.game.actions.transferAmber({ amount: amount });
            action.name = 'pay';
            return action.getEvent(context.player, context);
        }
    }),
    loseAmber: (amount = 1) => ({
        canPay: (context) => context.player.amber >= amount,
        payEvent: (context) =>
            context.game.actions.loseAmber({ amount: amount }).getEvent(context.player, context)
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
    })
};

module.exports = Costs;
