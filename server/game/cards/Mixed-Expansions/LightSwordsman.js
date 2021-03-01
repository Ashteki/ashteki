const Card = require('../../Card.js');

class LightSwordsman extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

LightSwordsman.id = 'light-swordsman';

module.exports = LightSwordsman;
