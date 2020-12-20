const Card = require('../../Card.js');

class MassiveGrowth extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.spellGuard()
        });

        this.whileAttached({
            effect: [ability.effects.modifyAttack(4), ability.effects.modifyLife(4)]
        });

        this.fleeting();
    }

    canAttach(card, context) {
        const myCondition = card.attack <= 2;
        return super.canAttach(card, context) && myCondition;
    }
}

MassiveGrowth.id = 'massive-growth';

module.exports = MassiveGrowth;
