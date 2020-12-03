const Card = require('../../Card.js');

class BloodShaman extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) =>
                context.event.triggeringEvent &&
                context.event.triggeringEvent.name === 'onCardDestroyed' &&
                context.event.triggeringEvent.damageEvent &&
                context.event.triggeringEvent.damageEvent.damageSource.owner ===
                    context.source.owner,
            gameAction: ability.actions.removeDamage((context) => ({
                amount: 1,
                target: context.source.owner.phoenixborn
            })),
            then: {
                target: {
                    toSelect: 'die',
                    gameAction: ability.actions.raiseDie()
                }
            }
        });
    }
}

BloodShaman.id = 'blood-shaman';

module.exports = BloodShaman;
