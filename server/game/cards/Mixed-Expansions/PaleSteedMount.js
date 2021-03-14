const Card = require('../../Card.js');

class PaleSteedMount extends Card {
    setupCardAbilities() {
        this.dismount();

        this.unitGuard();
    }
}

PaleSteedMount.id = 'pale-steed-mount';

module.exports = PaleSteedMount;
