const Card = require('../../Card.js');

class MirrorSpirit extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });
    }
}

MirrorSpirit.id = 'mirror-spirit';

module.exports = MirrorSpirit;
