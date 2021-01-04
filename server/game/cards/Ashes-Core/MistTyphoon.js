const Card = require('../../Card.js');

class MistTyphoon extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to all opponents units',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.player.opponent.unitsInPlay
            })),
            then: {
                alwaysTriggers: true,
                may: 'draw a card',
                gameAction: ability.actions.draw({ amount: 1 })
            }
        });
    }
}

MistTyphoon.id = 'mist-typhoon';

module.exports = MistTyphoon;
