const { Level } = require('../../constants');

class LowerDiceCost {
    constructor(properties) {
        this.numDice = properties.numDice;
        this.properties = properties;
        this.promptsPlayer = true;
    }

    canPay(context) {
        return context.player.activeNonBasicDiceCount >= this.numDice;
    }

    resolve(context, result) {
        let promptPlayer = () => {
            let buttons = [];
            if (result.canCancel) {
                buttons.push({ text: 'Cancel', arg: 'cancel' });
            }
            const title = this.properties.title ? this.properties.title + ': Select dice' : null;
            context.game.promptForDieSelect(context.player, {
                activePromptTitle: title || 'Select dice',
                mode: 'exactly',
                numDice: this.numDice,
                owner: 'self',
                context: context,
                buttons: buttons,
                dieCondition: (d) => !d.exhausted && d.level !== Level.Basic,
                onSelect: (player, dice) => {
                    context.costs.returnDice = dice;
                    return true;
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

        const payEvent = context.game.getEvent('onDiceLowered', params, (event) => {
            // event.context.changedDice = event.dice;
        });

        const lowerEvents = context.game.actions
            .lowerDie({ target: context.costs.returnDice })
            .getEventArray(context);

        for (let event of lowerEvents) {
            payEvent.addChildEvent(event);
        }

        return payEvent;
    }
}

module.exports = LowerDiceCost;
