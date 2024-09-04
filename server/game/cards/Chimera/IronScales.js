const AspectCard = require('../../solo/AspectCard');

class IronScales extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.limitDamageReceived(1)
        });

        this.defender();
    }
}

IronScales.id = 'iron-scales';

module.exports = IronScales;
