const Card = require('../../Card.js');

class OverchargedGrowth extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.modifyLife(1),
                ability.effects.modifyRecover(1),
                ability.effects.addKeyword({ terrifying: 1 }),
                ability.effects.addKeyword({ gigantic: 1 })
            ]
        });
    }
}

OverchargedGrowth.id = 'overcharged-growth';

module.exports = OverchargedGrowth;
