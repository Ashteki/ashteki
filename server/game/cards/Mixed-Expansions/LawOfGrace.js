const { PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class LawOfGrace extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            gameAction: ability.actions.removeDamage((context) => ({
                target: context.player.phoenixborn,
                amount: 1
            }))
        });

        this.forcedInterrupt({
            location: 'spellboard',
            autoResolve: true,
            when: {
                onDamageApplied: (event, context) =>
                    PhoenixbornTypes.includes(event.card.type) && !event.damageEvent.fightEvent
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 1
            }))
        });

        this.bound();
        this.fleeting();
    }
}

LawOfGrace.id = 'law-of-grace';

module.exports = LawOfGrace;
