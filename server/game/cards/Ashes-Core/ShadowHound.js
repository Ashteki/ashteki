const Card = require('../../Card.js');

class ShadowHound extends Card {
    setupCardAbilities(ability) {
        this.concealed();

        this.persistentEffect({
            effect: ability.effects.addKeyword({ preventguard: 1 })
        });
    }
}

ShadowHound.id = 'shadow-hound';

module.exports = ShadowHound;
