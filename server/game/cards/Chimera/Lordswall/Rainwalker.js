const AspectCard = require('../../../solo/AspectCard');

class Rainwalker extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.hordeAttack();
        this.feeble();

        this.ephemeral();
    }
}

Rainwalker.id = 'rainwalker';

module.exports = Rainwalker;
