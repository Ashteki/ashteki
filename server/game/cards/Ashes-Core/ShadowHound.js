const Card = require('../../Card.js');

class ShadowHound extends Card {
    setupCardAbilities() {
        this.concealed();

        this.stalk();
    }
}

ShadowHound.id = 'shadow-hound';

module.exports = ShadowHound;
