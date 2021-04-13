const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonAdmonisher extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Admonisher',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Divine)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'admonisher',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.focus > 0 &&
                    (!context.preThenEvent || context.preThenEvent.unable),
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.player.opponent.phoenixborn
                }))
            }
        });
    }
}

SummonAdmonisher.id = 'summon-admonisher';

module.exports = SummonAdmonisher;
