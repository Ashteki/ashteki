const Dice = require('../dice');

class XDiceCost {
    constructor(properties) {
        this.diceReq = properties.diceReq;
        this.properties = properties;
        this.promptsPlayer = true;
    }

    canPay(context) {
        // assumption that xdice is only one req, of one type
        return Dice.findADie(context.player.getSpendableDice(context), this.getDiceReq(context)[0]);
        // return Dice.canMatch(context.player.getSpendableDice(context), this.getDiceReq(context));
    }

    // eslint-disable-next-line no-unused-vars
    getDiceReq(context) {
        return this.diceReq;
    }

    resolve(context, result) {
        let chosenDice = [];

        let promptPlayer = () => {
            let buttons = [];
            if (chosenDice.length > 0) {
                buttons.push({ text: 'Done', arg: 'done' });
            }
            if (result.canCancel) {
                buttons.push({ text: 'Cancel', arg: 'cancel' });
            }
            const title = this.properties.title ? this.properties.title + ': Select dice' : null;
            context.game.promptForDieSelect(context.player, {
                activePromptTitle: title || 'Select dice',
                mode: 'unlimited',
                selectedDice: chosenDice,
                context: context,
                buttons: buttons,
                format: this.getDiceReq(context),
                dieCondition: (d) => !d.exhausted,
                onSelect: (player, dice) => {
                    chosenDice = dice;
                    context.costs.returnDice = chosenDice;
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
    }

    payEvent(context) {
        return context.game.actions
            .exhaustDie({ target: context.costs.returnDice })
            .getEventArray(context);
    }
}

module.exports = XDiceCost;
