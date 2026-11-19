const Card = require('../../Card.js');

class Futility extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.addKeyword({ terrifying: 1 }), ability.effects.modifyAttack(1)]
        });
    }

    canAttach(card, context) {
        return super.canAttach(card, context) && card.upgrades.length === 0;
    }
}

Futility.id = 'futility';

module.exports = Futility;
