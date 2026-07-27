const AspectCard = require('../../../solo/AspectCard');

class QuickShot extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            gameAction: ability.actions.addStatusToken((context) => ({
                target: context.player.phoenixborn
            }))
        });
    }
}

QuickShot.id = 'quick-shot';

module.exports = QuickShot;
