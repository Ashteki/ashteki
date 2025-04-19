const { Magic } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Photosynthesize extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            gameAction: ability.actions.raiseDie((context) => ({
                target: context.source.owner.getBasicDie(Magic.Rage),
                showMessage: true
            }))
        });
    };
}

Photosynthesize.id = 'photosynthesize';

module.exports = Photosynthesize;
