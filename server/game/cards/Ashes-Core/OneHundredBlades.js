const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class OneHundredBlades extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'One Hundred Blades',
            effect: 'deal 1 damage to all opponents units, and phoenixborn',
            target: {
                cardType: CardType.Phoenixborn,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.player.opponent.unitsInPlay
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.draw({ amount: 1 })
                }
            }
        });
    }
}

OneHundredBlades.id = 'one-hundred-blades';

module.exports = OneHundredBlades;
