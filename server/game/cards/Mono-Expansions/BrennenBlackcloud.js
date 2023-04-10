const { Level, Magic, CardType, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class BrennenBlackcloud extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Spirit Burn',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            target: {
                activePromptTitle: 'Destroy a Unit',
                cardType: CardType.Ally,
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    cardType: PhoenixbornTypes,
                    gameAction: ability.actions.dealDamage({ amount: 2, showMessage: true })
                }
            }
        });
    }
}

BrennenBlackcloud.id = 'brennen-blackcloud';

module.exports = BrennenBlackcloud;
