const Card = require('../../Card.js');

class ButterflyMonk extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyLife((card) => this.countMyType(card))
        });

        this.leavesPlay({
            target: {
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Last blessing',
                cardType: ['Ally', 'Conjuration', 'Phoenixborn'],
                gameAction: ability.actions.removeDamage({ amount: 1 })
            }
        });
    }

    countMyType(card) {
        return card.controller.getNumberOfCardsInPlay((c) => c.id == card.id);
    }
}

ButterflyMonk.id = 'butterfly-monk';

module.exports = ButterflyMonk;
