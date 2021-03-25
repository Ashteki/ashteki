const Dice = require('../dice');

class DiceCost {
    constructor(properties) {
        this.diceReq = properties.diceReq;
        this.properties = properties;
        this.promptsPlayer = true;
    }

    canPay(context) {
        return Dice.canMatch(context.player.dice, this.getDiceReq(context));
    }

    // eslint-disable-next-line no-unused-vars
    getDiceReq(context) {
        return this.diceReq;
    }

    resolve(context, result) {
        const nonParallels = this.getDiceReq(context).filter((r) => !Array.isArray(r));
        const nonBasics = nonParallels.filter((r) => r.level !== 'basic');
        let chosenDice = Dice.matchDice(context.player.dice, nonBasics);
        if (
            !context.source.preventAutoDice &&
            chosenDice.length == Dice.getRequiredCount(this.getDiceReq(context))
        ) {
            context.costs.returnDice = chosenDice;
            return true;
        }

        let promptPlayer = () => {
            let buttons = [];
            if (Dice.canMatch(chosenDice, this.getDiceReq(context))) {
                buttons.push({ text: 'Done', arg: 'done' });
            }
            if (result.canCancel) {
                buttons.push({ text: 'Cancel', arg: 'cancel' });
            }
            const title = this.properties.title ? this.properties.title + ': Select dice' : null;
            context.game.promptForDieSelect(context.player, {
                activePromptTitle: title || 'Select dice',
                mode: 'match',
                selectedDice: chosenDice,
                owner: 'self',
                context: context,
                buttons: buttons,
                format: this.getDiceReq(context),
                dieCondition: (d) => !d.exhausted,
                onSelect: (player, dice) => {
                    chosenDice = dice;
                    // match returns an array SINGLE does not
                    if (!Dice.canMatch(chosenDice, this.getDiceReq(context))) {
                        //promptPlayer();
                        return false;
                    } else {
                        context.costs.returnDice = chosenDice;
                        return true;
                    }
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
    }

    payEvent(context) {
        const params = {
            dice: context.costs.returnDice,
            player: context.player
        };

        const payEvent = context.game.getEvent('onDiceSpent', params);
        const exhaustEvents = context.game.actions
            .exhaustDie({ target: context.costs.returnDice })
            .getEventArray(context);
        for (let event of exhaustEvents) {
            payEvent.addChildEvent(event);
        }

        return payEvent;
    }
}

module.exports = DiceCost;
