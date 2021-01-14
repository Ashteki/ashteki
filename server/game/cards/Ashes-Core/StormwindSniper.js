const Card = require('../../Card.js');

class StormwindSniper extends Card {
    setupCardAbilities() {
        this.concealed();

        this.ambush(1);
    }
}

StormwindSniper.id = 'stormwind-sniper';

module.exports = StormwindSniper;
