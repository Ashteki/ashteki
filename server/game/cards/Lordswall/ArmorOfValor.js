const { PhoenixbornTypes } = require('../../../constants');
const Card = require('../../Card.js');

class ArmorOfValor extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onDamageApplied: (event, context) =>
                    event.card == context.player.phoenixborn &&
                    (
                        // guarding
                        event.fightEvent?.battle.guard === context.source.parent ||
                        // or own ability
                        event.damageSource === context.source.parent
                    )
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: 1
            }))
        });
    }

    canAttach(card) {
        return card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade();
    }
}

ArmorOfValor.id = 'armor-of-valor';

module.exports = ArmorOfValor;
