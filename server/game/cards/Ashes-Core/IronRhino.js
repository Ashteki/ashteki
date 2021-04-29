const Card = require('../../Card.js');

class IronRhino extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 1 })
        });

        // overkill 2
        this.overkill(2);
    }
}

IronRhino.id = 'iron-rhino';

module.exports = IronRhino;
