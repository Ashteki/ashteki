const Card = require('../../Card.js');

class SpectralChargerMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

SpectralChargerMount.id = 'spectral-charger-mount';

module.exports = SpectralChargerMount;
