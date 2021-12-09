const Card = require('../../Card.js');

class NaturesWrath extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: "Nature's Wrath",
            effect: 'deal 1 damage to all units',
            gameAction: ability.actions.aoeDamage((context) => ({
                amount: 1,
                cards: context.game.unitsInPlay,
                promptTitle: "Nature's Wrath"
            }))
        });
    }
}

NaturesWrath.id = 'natures-wrath';

module.exports = NaturesWrath;
