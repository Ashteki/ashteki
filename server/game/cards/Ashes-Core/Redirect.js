const Card = require('../../Card.js');

class Redirect extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            // if card is phoenixborn, and unit is in play, do damage to that unit instead
            optional: true, //todo: does it need this?
            when: {
                onDamageDealt: (event, context) =>
                    // damage is done to this player's pb
                    event.card == context.player.phoenixborn
            },
            effect: 'redirect the damage',
            //todo: should use changeEvent to change target of dealDamage Event
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.player.phoenixborn
            }))
        });
    }
}

Redirect.id = 'redirect';

module.exports = Redirect;
