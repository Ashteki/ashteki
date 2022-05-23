const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class OneHundredBlades extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'One Hundred Blades',
            effect: "deal 1 damage to {0} and all opponent's units",
            target: {
                cardType: CardType.Phoenixborn,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    autoTarget: (context) => context.player.opponent.unitsInPlay,
                    gameAction: ability.actions.orderedAoE({
                        gameAction: ability.actions.dealDamage(),
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
