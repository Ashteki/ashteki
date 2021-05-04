const Card = require('../../Card.js');

class TurtleGuard extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        // rooted
        this.persistentEffect({
            effect: ability.effects.cardCannot('attack')
        });

        // withdraw
        this.persistentEffect({
            condition: () => this.exhausted,
            effect: ability.effects.preventAllDamage('Withdraw')
        });
    }
}

TurtleGuard.id = 'turtle-guard';

module.exports = TurtleGuard;
