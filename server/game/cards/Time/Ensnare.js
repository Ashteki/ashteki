const Card = require('../../Card.js');

class Ensnare extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDefendersDeclared: (event, context) =>
                    event.attack.attackingPlayer === context.source.owner && // my attack
                    event.attack.battles.some((b) => b.guard) // guard was declared
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.event.attack.battles[0].guard // assumes a guard will only occur in one battle
                //showMessage: true
            }))
        });
    }
}

Ensnare.id = 'ensnare';

module.exports = Ensnare;

