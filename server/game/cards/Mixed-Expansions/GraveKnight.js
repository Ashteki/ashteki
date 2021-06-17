const Card = require('../../Card.js');

class GraveKnight extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.threatening(), ability.effects.addKeyword({ overkill: 1 })]
        });
    }
}

GraveKnight.id = 'grave-knight';

module.exports = GraveKnight;
