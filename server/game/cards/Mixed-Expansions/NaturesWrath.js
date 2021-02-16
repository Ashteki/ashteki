const Card = require('../../Card.js');

class NaturesWrath extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: "Nature's Wrath",
            effect: 'deal 1 damage to all units',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.unitsInPlay
            }))
        });
    }
}

NaturesWrath.id = 'natures-wrath';

module.exports = NaturesWrath;
