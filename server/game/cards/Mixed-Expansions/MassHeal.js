const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class MassHeal extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mass Heal',
            gameAction: ability.actions.conditional((context) => ({
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
                    },
                    messages: {
                        'Heal your units and PB': '{0} chooses to heal their units and PB',
                        'Remove wounds from all units': '{0} chooses to heal all units'
                    } // This gets into the ChooseGameAction function
                })),
                falseGameAction: ability.actions.removeDamage({
                    amount: 1,
                    target: context.game.unitsInPlay,
                    message: '{0} heals all units', // this doesn't work as removeDamage doesn't pass the message on
                    showMessage: true
                })
            }))
        });
    }
}

MassHeal.id = 'mass-heal';

module.exports = MassHeal;
