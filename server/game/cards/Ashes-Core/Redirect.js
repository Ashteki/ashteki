const Card = require('../../Card.js');

class Redirect extends Card {
    // eslint-disable-next-line no-unused-vars
    setupCardAbilities(ability) {
        this.interrupt({
            // if card is phoenixborn, and unit is in play, do damage to that unit instead
            when: {
                onDamageDealt: (event, context) =>
                    // damage is done to this player's pb
                    event.card == context.player.phoenixborn
            },
            condition: (context) => context.player.cardsInPlay.length > 0,
            effect: 'redirect the damage - MANUAL!!'
            //todo: should use changeEvent to change target of dealDamage Event
            // copy shadow self here...
            // gameAction: ability.actions.addStatusToken((context) => ({
            //     amount: 1,
            //     target: context.player.phoenixborn
            // }))
        });
    }
}

Redirect.id = 'redirect';

module.exports = Redirect;
