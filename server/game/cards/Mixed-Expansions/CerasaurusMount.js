const Card = require('../../Card.js');

class CerasaurusMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        this.persistentEffect({
            effect: [ability.effects.addKeyword({ overkill: 1 })]
        });
    }
}

CerasaurusMount.id = 'cerasaurus-mount';

module.exports = CerasaurusMount;
