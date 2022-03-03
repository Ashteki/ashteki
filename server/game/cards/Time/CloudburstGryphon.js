const Card = require('../../Card.js');

class CloudburstGryphon extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

CloudburstGryphon.id = 'cloudburst-gryphon';

module.exports = CloudburstGryphon;
