const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class MassHeal extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mass Heal',
            gameAction: ability.actions.chooseAction((context) => {
                const choices = {};
                if (
                    context.player.dice.some(
                        (d) => d.magic === Magic.Divine && d.level !== Level.Basic && !d.exhausted
                    )
                ) {
                    choices['Heal PB + Units'] = ability.actions.removeDamage({
                        amount: 1,
                        target: [context.player.phoenixborn, ...context.player.unitsInPlay]
                    });
                }
                choices['Heal all units'] = ability.actions.removeDamage({
                    amount: 1,
                    target: context.game.unitsInPlay
                });
                return {
                    choices: choices,
                    messages: {
                        'Remove a wound from your units and PB':
                            '{0} removes 1 wound from their units and PB',
                        'Remove a wound from all units': '{0} removes 1 wound from all units'
                    }
                };
            })
        });
    }
}

MassHeal.id = 'mass-heal';

module.exports = MassHeal;
