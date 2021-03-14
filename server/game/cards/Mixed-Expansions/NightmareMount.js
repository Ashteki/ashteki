const Card = require('../../Card.js');

class NightmareMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 1 })
        });
    }
}

NightmareMount.id = 'nightmare-mount';

module.exports = NightmareMount;
