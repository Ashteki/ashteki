const AspectCard = require('../../../solo/AspectCard');

class RapidFlight extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

RapidFlight.id = 'rapid-flight';

module.exports = RapidFlight;
