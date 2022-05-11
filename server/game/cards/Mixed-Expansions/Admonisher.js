const Card = require('../../Card.js');

class Admonisher extends Card {
    setupCardAbilities(ability) {
        // end of round wounds pb
        this.forcedInterrupt({
            autoResolve: true,

            title: 'Rebuke 1',
            when: {
                onRoundEnded: () => true
            },
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({
                    amount: 1
                })
            }
        });
    }
}

Admonisher.id = 'admonisher';

module.exports = Admonisher;
