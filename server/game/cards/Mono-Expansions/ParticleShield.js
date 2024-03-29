const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ParticleShield extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    BattlefieldTypes.includes(event.card.type) &&
                    event.card.controller === context.player
            },
            effect: 'prevent 1 damage and draw a card',
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 1
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw({ showMessage: true })
            }
        });
    }
}

ParticleShield.id = 'particle-shield';

module.exports = ParticleShield;
