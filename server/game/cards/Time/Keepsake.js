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
                    event.diceOwner === context.player.opponent && event.change === 'lower'
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
        let amount = context.event.dice ? context.event.dice.length : 1;
        if (amount + this.status > 4) {
            amount = 4 - this.status;
        }
        return amount;
    }
}

Keepsake.id = 'keepsake';

module.exports = Keepsake;
