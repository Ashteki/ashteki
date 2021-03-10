const Card = require('../../Card.js');

class BloodShaman extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            inexhaustible: true,
            condition: (context) => context.event.context.player === context.source.controller,
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
