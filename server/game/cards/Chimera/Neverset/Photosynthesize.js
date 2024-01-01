const { Magic } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Photosynthesize extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            gameAction: ability.actions.raiseDie((context) => ({
                target: context.source.owner.getBasicDie(Magic.Rage),
                showMessage: true
            }))

        });
    };

    get statusCount() {
        return 3;
    }
}

Photosynthesize.id = 'photosynthesize';

module.exports = Photosynthesize;
