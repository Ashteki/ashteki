const Card = require('../../Card.js');

class OneHundredBlades extends Card {
    setupCardAbilities(ability) {
        this.play({
            // cost: [
            //     ability.costs.spendMain(),
            //     ability.costs.dice([{ level: 'basic' }, { level: 'basic' }])
            // ],
            effect: 'deal 1 damage to all opponents units, and phoenixborn',
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.player.opponent.phoenixborn
                })),
                ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.player.opponent.creaturesInPlay
                }))
            ],
            then: {
                gameAction: ability.actions.draw({ amount: 1 })
            }
        });
    }
}

OneHundredBlades.id = 'one-hundred-blades';

module.exports = OneHundredBlades;
