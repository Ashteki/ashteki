const Card = require('../../Card.js');

class NaturesWrath extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: "Nature's Wrath",
            effect: 'deal 1 damage to all units',
            target: {
                autoTarget: (context) => context.game.unitsInPlay,
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.dealDamage(),
                    promptTitle: "Nature's Wrath"
                })
            }
        });
    }
}

NaturesWrath.id = 'natures-wrath';

module.exports = NaturesWrath;
