const Card = require('../../Card.js');

class MistTyphoon extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mist Typhoon',
            effect: "deal 1 damage to all opponent's units",
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent.unitsInPlay,
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.dealDamage(),
                    promptTitle: 'Mist Typhoon'
                })
            },
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
