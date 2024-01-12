const { PhoenixbornTypes } = require('../../../constants');
const Card = require('../../Card.js');

class Embrace extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onDamageApplied: (event, context) =>
                    PhoenixbornTypes.includes(event.card.type) &&
                    event.damageSource.controller !== event.card.owner
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

    canAttach(card) {
        return card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade();
    }
}

Embrace.id = 'embrace';

module.exports = Embrace;
