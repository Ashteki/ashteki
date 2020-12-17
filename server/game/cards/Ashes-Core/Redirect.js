const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Redirect extends Card {
    // eslint-disable-next-line no-unused-vars
    setupCardAbilities(ability) {
        this.interrupt({
            // if card is phoenixborn, and unit is in play, do damage to that unit instead
            when: {
                onDamageDealt: (event, context) => event.card == context.player.phoenixborn
            },
            condition: (context) => context.player.cardsInPlay.length > 0,
            effect: 'redirect the damage - MANUAL!!',
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.changeEvent((context) => ({
                    event: context.event,
                    card: context.target
                }))
            }
        });
    }
}

Redirect.id = 'redirect';

module.exports = Redirect;
