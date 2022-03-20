const Card = require('../../Card.js');
const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const DiceCount = require('../../DiceCount.js');

class Keepsake extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onDiceRerolled: (event, context) => event.diceOwner === context.player.opponent,
                onDieChange: (event, context) =>
                    event.diceOwner === context.player.opponent && event.change === 'lower',
                onChangeDice: (event, context) => {
                    // I'm changing the dice
                    return (
                        event.player === context.player &&
                        event.owner !== 'self' &&
                        (event.context.changedDice.some(
                            (d) => d.owner === context.player.opponent
                        ) ||
                            event.context.changedDice[0].some(
                                (d) => d.owner === context.player.opponent
                            ))
                    );
                }
            },
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: this.getTokenAmount(context),
                target: context.source
            }))
        });

        this.action({
            title: 'Use Keepsake',
            cost: [
                ability.costs.mainAction(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            gameAction: ability.actions.discard((context) => ({
                preEventHandler: () => {
                    this.amount = context.source.status;
                },
                target: this
            })),
            then: {
                target: {
                    cardType: BattlefieldTypes,
                    controller: 'any',
                    gameAction: ability.actions.dealDamage(() => ({
                        amount: this.amount,
                        showMessage: true
                    }))
                }
            }
        });
    }
    getTokenAmount(context) {
        let amount = 0;
        switch (context.event.name) {
            case 'onChangeDice':
                amount =
                    context.event.context.changedDice.filter(
                        (d) => d.owner === context.player.opponent
                    ).length ||
                    context.event.context.changedDice[0].filter(
                        (d) => d.owner === context.player.opponent
                    ).length;
                break;
            case 'onDiceRerolled':
                amount = context.event.dice.length;
                break;
            case 'onDieChange':
                amount = 1;
                break;
            default:
                throw new Error('dice event not recognised by keepsake');
        }
        if (amount + this.status > 4) {
            amount = 4 - this.status;
        }
        return amount;
    }
}

Keepsake.id = 'keepsake';

module.exports = Keepsake;
