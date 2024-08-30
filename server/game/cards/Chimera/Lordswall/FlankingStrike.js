const AspectCard = require('../../../solo/AspectCard.js');

class FlankingStrike extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            target: {
                mode: 'auto',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

FlankingStrike.id = 'flanking-strike';

module.exports = FlankingStrike;
