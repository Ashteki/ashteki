const { CardType, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class OneHundredBlades extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'One Hundred Blades',
            effect: "deal 1 damage to {0} and all opponent's units",
            target: {
                cardType: PhoenixbornTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    ignoreTargetCheck: true,
                    autoTarget: (context) => context.player.opponent.unitsInPlay,
                    gameAction: ability.actions.orderedAoE({
                        gameAction: ability.actions.dealDamage({ showMessage: true }),
                        promptTitle: 'One Hundred Blades'
                    })
                },
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.draw()
                }
            }
        });
    }
}

OneHundredBlades.id = 'one-hundred-blades';

module.exports = OneHundredBlades;
