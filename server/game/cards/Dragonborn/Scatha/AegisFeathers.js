const AspectCard = require('../../../solo/AspectCard');

class AegisFeathers extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        this.destroyed({
            condition: (context) => context.player.unitsInPlay.length > 0,
            target: {
                autoTarget: (context) => context.player.battlefield[0],
                gameAction: ability.actions.removeExhaustion()
            }
        });
    }
}

AegisFeathers.id = 'aegis-feathers';

module.exports = AegisFeathers;
