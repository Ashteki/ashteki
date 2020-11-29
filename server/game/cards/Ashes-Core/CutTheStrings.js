const { Level, Magic, BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class CutTheStrings extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Cut the Strings',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            targets: {
                first: {
                    player: 'self',
                    cardType: [...BattlefieldTypes],
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                second: {
                    dependsOn: 'first',
                    cardType: CardType.Upgrade,
                    gameAction: ability.actions.discard()
                }
            }
        });
    }
}

CutTheStrings.id = 'cut-the-strings';

module.exports = CutTheStrings;
