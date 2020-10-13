const Card = require('../../Card.js');

class MistTyphoon extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to all opponents units',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.player.opponent.creaturesInPlay
            })),
            then: {
                optional: true,
                gameAction: ability.actions.draw({ amount: 1 })
            }
        });
    }
}

MistTyphoon.id = 'mist-typhoon';

module.exports = MistTyphoon;
