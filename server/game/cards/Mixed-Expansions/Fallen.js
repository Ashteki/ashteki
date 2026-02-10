const Card = require('../../Card.js');

class Fallen extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.unpreventable(
                (_, effectContext) =>
                    effectContext.source.isAttacker || effectContext.source.isDefender
            )
        });
    }
}

Fallen.id = 'fallen';

module.exports = Fallen;
