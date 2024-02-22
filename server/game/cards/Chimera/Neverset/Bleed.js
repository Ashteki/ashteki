const Card = require('../../../Card.js');

class Bleed extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('forcedInterrupt', {
                    autoResolve: true,
                    inexhaustible: true,
                    title: 'Bleed 1',
                    when: {
                        onTurnEnded: (event, context) => event.player === context.player
                    },
                    gameAction: ability.actions.addDamageToken({ amount: 1 })
                })
            ]
        });
    }
}

Bleed.id = 'bleed';

module.exports = Bleed;
