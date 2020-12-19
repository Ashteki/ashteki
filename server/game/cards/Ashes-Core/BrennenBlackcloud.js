const { Level, Magic, BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class BrennenBlackcloud extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Spirit Burn',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            targets: {
                myUnit: {
                    activePromptTitle: 'Destroy a Unit',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                },
                phb: {
                    dependsOn: 'myUnit',
                    cardType: CardType.Phoenixborn,
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            }
        });
    }
}

BrennenBlackcloud.id = 'brennen-blackcloud';

module.exports = BrennenBlackcloud;
