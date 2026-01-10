const { Level } = require('../../constants');
const Dice = require('../dice');

class DiceCost {
    constructor(properties) {
        this.diceReq = properties.diceReq;
        this.properties = properties;
        this.promptsPlayer = true;
    }

    canPay(context) {
        const usableDice = context.player
            .getUsableDice(context)
            .filter((d) => this.costDieCondition(d, context));
        return Dice.canMatch(usableDice, this.getDiceReq(context));
    }

    // eslint-disable-next-line no-unused-vars
    getDiceReq(context) {
        return this.diceReq;
    }

    costDieCondition(die, context) {
        return (
            !die.exhausted &&
            (die.level !== Level.Basic || context.player.checkRestrictions('useBasicDice')) &&
            (!die.parent || die.parent.canSpendDieUpgrades(context))
        );
    }

    resolve(context, result) {
        //TODO: change here to match parallels and non-basics
        // const nonParallels = this.getDiceReq(context).filter((r) => !Array.isArray(r));
        // const nonBasics = nonParallels.filter((r) => r.level !== 'basic');
        const nonBasics = this.getDiceReq(context).filter(
            (r) => Array.isArray(r) || r.level !== 'basic'
        );

        const dice = context.player.dice; // only match / auto select from dice in active dice pool (not on cards)
        let chosenDice = Dice.matchDice(dice, nonBasics);
        if (
            !context.source.preventAutoDice &&
            !context.player.anyEffect('preventAutoDice') &&
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
                dieCondition: this.costDieCondition,
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

        const payEvent = context.game.getEvent('onDiceSpent', params, (event) => {
            event.player.totalDiceSpend += event.dice.length;
        });

        const exhaustEvents = context.game.actions
            .exhaustDie({ target: context.costs.returnDice })
            .getEventArray(context);
        // spent dice are placed in the dice pool (removed from cards)
        context.costs.returnDice.forEach((die) => {
            if (die.parent) {
                payEvent.addChildEvent(context.game.actions.detachDie().getEvent(die, context));
            }
        });

        for (let event of exhaustEvents) {
            payEvent.addChildEvent(event);
        }

        return payEvent;
    }
}

module.exports = DiceCost;
