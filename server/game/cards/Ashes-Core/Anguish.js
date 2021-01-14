const Card = require('../../Card.js');

class Anguish extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Anguish',
            target: {
                mode: 'select',
                player: 'opponent',
                choices: {
                    Discard: ability.actions.conditional({
                        condition: (context) => context.player.opponent.hand.length > 0,
                        trueGameAction: ability.actions.discardAtRandom(),
                        falseGameAction: ability.actions.dealDamage((context) => ({
                            target: context.player.opponent.phoenixborn,
                            amount: 2
                        }))
                    }),
                    Damage: ability.actions.dealDamage((context) => ({
                        target: context.player.opponent.phoenixborn,
                        amount: 2
                    }))
                }
            }
            // ,
            // then: {
            //     target: {
            //         mode: 'select',
            //         choices: {
            //             'Exhaust 2 dice': ability.actions.conditional({
            //                 condition: (context) =>
            //                     context.player.opponent.dice.filter((d) => !d.exhausted).length >= 2,
            //                 trueGameAction: ability.actions.exhaustDice({ }),
            //                 falseGameAction: ability.actions.dealDamage((context) => ({
            //                     target: context.player.opponent.phoenixborn,
            //                     amount: 2
            //                 }))
            //             }),
            //             Damage: ability.actions.dealDamage((context) => ({
            //                 target: context.player.opponent.phoenixborn,
            //                 amount: 2
            //             }))
            //         }
            //     },
            // }
        });
    }
}

Anguish.id = 'anguish';

module.exports = Anguish;
