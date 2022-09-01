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
            gameAction: ability.actions.summon({
                conjuration: 'admonisher'
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.focus > 0 &&
                    (!context.preThenEvent?.childEvent ||
                        (context.preThenEvent.childEvent.name === 'onCardEntersPlay' &&
                            context.preThenEvent.childEvent.cancelled)),
                target: {
                    autoTarget: (context) => context.player.opponent.phoenixborn,
                    gameAction: ability.actions.dealDamage({
                        amount: 1,
                        showMessage: true
                    })
                }
            }
        });
    }
}

SummonAdmonisher.id = 'summon-admonisher';

module.exports = SummonAdmonisher;
