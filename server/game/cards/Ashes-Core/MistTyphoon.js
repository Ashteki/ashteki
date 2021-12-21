const Card = require('../../Card.js');

class MistTyphoon extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mist Typhoon',
            effect: "deal 1 damage to all opponent's units",
            // gameAction: ability.actions.dealDamage((context) => ({
            //     target: context.player.opponent.unitsInPlay
            // }))
            gameAction: ability.actions.orderedAoE((context) => ({
                gameAction: ability.actions.dealDamage(),
                cards: context.player.opponent.unitsInPlay,
                promptTitle: 'Mist Typhoon'
            })),
            then: {
                alwaysTriggers: true,
                may: 'draw a card',
                gameAction: ability.actions.draw({ showMessage: true })
            }
        });
    }
}

MistTyphoon.id = 'mist-typhoon';

module.exports = MistTyphoon;
