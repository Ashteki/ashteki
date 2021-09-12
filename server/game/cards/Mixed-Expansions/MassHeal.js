const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class MassHeal extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mass Heal',
            gameAction: ability.actions.conditional((context) => ({
                // target: context.source.parent,
                condition: () =>
                    context.player.dice.some(
                        (d) => d.magic === Magic.Divine && d.level !== Level.Basic && !d.exhausted
                    ),
                trueGameAction: ability.actions.chooseAction((context) => ({
                    choices: {
                        'Heal your units and PB': ability.actions.removeDamage({
                            amount: 1,
                            target: [context.player.phoenixborn, ...context.player.unitsInPlay]
                        }),
                        'Remove wounds from all units': ability.actions.removeDamage({
                            amount: 1,
                            target: context.game.unitsInPlay
                        })
                    }
                })),
                falseGameAction: ability.actions.removeDamage({
                    amount: 1,
                    target: context.game.unitsInPlay
                })
            }))
        });
    }
}

MassHeal.id = 'mass-heal';

module.exports = MassHeal;
