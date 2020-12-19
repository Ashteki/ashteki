const Card = require('../../Card.js');

class StormwindSniper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.concealed()
        });

        this.ambush(1);
    }
}

StormwindSniper.id = 'stormwind-sniper';

module.exports = StormwindSniper;
