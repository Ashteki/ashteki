const Card = require('../../Card.js');

class MistTyphoon extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mist Typhoon',
            effect: "deal 1 damage to all opponent's units",
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.player.opponent.unitsInPlay
            })),
            then: {
                alwaysTriggers: true,
                may: 'draw a card',
                gameAction: ability.actions.draw()
            }
        });
    }
}

MistTyphoon.id = 'mist-typhoon';

module.exports = MistTyphoon;
