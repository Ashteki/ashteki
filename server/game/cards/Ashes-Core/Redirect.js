const Card = require('../../Card.js');

class Redirect extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardPlayed: () => true
            },
            effect: 'redirect the damage',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.player.opponent.phoenixborn
            }))
        });
    }
}

Redirect.id = 'redirect';

module.exports = Redirect;
