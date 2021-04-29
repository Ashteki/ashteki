const Card = require('../../Card.js');

class CerasaurusMount extends Card {
    setupCardAbilities() {
        this.dismount();

        this.overkill(1);
    }
}

CerasaurusMount.id = 'cerasaurus-mount';

module.exports = CerasaurusMount;
