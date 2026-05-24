const AspectCard = require('../../../solo/AspectCard');

class Sear extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

Sear.id = 'sear';

module.exports = Sear;
