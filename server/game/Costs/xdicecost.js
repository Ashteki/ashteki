const Dice = require('../dice');
const DiceCost = require('./dicecost');

class XDiceCost extends DiceCost {
    canPay(context) {
        // assumption that xdice is only one req, of one type
        return Dice.findADie(context.player.getSpendableDice(context), this.getDiceReq(context)[0]);
        // return Dice.canMatch(context.player.getSpendableDice(context), this.getDiceReq(context));
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
}

module.exports = XDiceCost;
