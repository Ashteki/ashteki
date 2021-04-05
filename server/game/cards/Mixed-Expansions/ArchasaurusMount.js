const Card = require('../../Card.js');

class ArchasaurusMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 2 })
        });
    }
}

ArchasaurusMount.id = 'archasaurus-mount';

module.exports = ArchasaurusMount;
