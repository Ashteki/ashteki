const { PhoenixbornTypes } = require('../../../constants');
const Card = require('../../Card.js');

class Embrace extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onDamageApplied: (event, context) => event.card == context.player.phoenixborn
            },
            gameAction: [
                ability.actions.discard({ target: this }),
                ability.actions.preventDamage((context) => ({
                    event: context.event,
                    amount: 'all'
                }))
            ]
        });
    }

    canAttach(card, context) {
        return (
            card &&
            PhoenixbornTypes.includes(card.getType()) &&
            !card.exhausted &&
            this.canPlayAsUpgrade()
        );
    }
}

Embrace.id = 'embrace';

module.exports = Embrace;
