const AspectCard = require('../../../solo/AspectCard');

class UnendingForces extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker'
            })
        });
    }

    get statusCount() {
        return 3;
    }
}

UnendingForces.id = 'unending-forces';

module.exports = UnendingForces;
