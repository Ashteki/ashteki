const { Level, Magic, CardType, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class FrostBite extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Frost Bite',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dynamicDice((context) => {
                    let level = context.source.focus ? Level.Basic : Level.Class;
                    return [new DiceCount(1, level, Magic.Natural)];
                })
            ],
            location: 'spellboard',
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

FrostBite.id = 'frost-bite';

module.exports = FrostBite;
