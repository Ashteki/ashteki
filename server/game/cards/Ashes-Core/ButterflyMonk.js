const Card = require('../../Card.js');

class ButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyLife((card) => this.countMyType(card))
        });
    }

    countMyType(card) {
        return card.controller.getNumberOfCardsInPlay((c) => c.id == card.id);
    }
}

ButterflyMonk.id = 'butterfly-monk';

module.exports = ButterflyMonk;
