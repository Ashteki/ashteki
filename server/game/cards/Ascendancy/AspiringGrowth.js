const Card = require('../../Card.js');

class AspiringGrowth extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(2),
                ability.effects.modifyLife(1)
            ]
        });
    }

    canAttach(card, context) {
        const myCondition = card.attack <= 2;
        return super.canAttach(card, context) && myCondition;
    }
}

AspiringGrowth.id = 'aspiring-growth';

module.exports = AspiringGrowth;
