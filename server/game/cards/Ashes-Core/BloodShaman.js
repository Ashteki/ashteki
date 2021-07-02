const Card = require('../../Card.js');

class BloodShaman extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            inexhaustible: true,
            // condition triggers before the when: test, so need to ensure just respond to this card destroyed
            condition: (context) => context.source === context.event.card &&
                context.event.context.player === context.source.controller,
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
