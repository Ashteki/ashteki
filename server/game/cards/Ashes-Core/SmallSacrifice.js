const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SmallSacrifice extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Cut the Strings',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            location: 'spellboard',
            targets: {
                first: {
                    player: 'self',
                    cardType: [...BattlefieldTypes],
                    gameAction: ability.actions.dealDamage()
                },
                second: {
                    dependsOn: 'first',
                    player: 'opponent',
                    cardType: [...BattlefieldTypes],
                    gameAction: ability.actions.dealDamage()
                }
            }
        });
    }
}

SmallSacrifice.id = 'small-sacrifice';

module.exports = SmallSacrifice;
