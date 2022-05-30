const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Redirect extends Card {
    // eslint-disable-next-line no-unused-vars
    setupCardAbilities(ability) {
        this.interrupt({
            // if card is phoenixborn, and unit is in play, do damage to that unit instead
            when: {
                onDamageApplied: (event, context) => event.card == context.player.phoenixborn
            },
            condition: (context) => context.player.unitsInPlay.length > 0,
            effect: 'redirect the damage',
            target: {
                showCancel: true,
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
