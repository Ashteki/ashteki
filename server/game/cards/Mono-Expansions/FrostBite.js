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
                    return context.source.focus
                        ? [new DiceCount(1, Level.Basic)]
                        : [new DiceCount(1, Level.Class, Magic.Natural)];
                })
            ],
            location: 'spellboard',
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

FrostBite.id = 'frost-bite';

module.exports = FrostBite;
