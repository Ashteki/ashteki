const AspectCard = require('../../../solo/AspectCard');

class UnendingForces extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker'
            })
        });
    }
}

UnendingForces.id = 'unending-forces';

module.exports = UnendingForces;
