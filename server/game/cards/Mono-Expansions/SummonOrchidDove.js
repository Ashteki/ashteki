const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonOrchidDove extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Orchid Dove',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dynamicDice((context) => {
                    return context.source.focus
                        ? [new DiceCount(1, Level.Basic)]
                        : [new DiceCount(1, Level.Class, Magic.Charm)];
                })
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'orchid-dove'
            }),
            then: {
                alwaysTriggers: true,
                may: "deal 1 damage to opponent's PB",
                condition: (context) =>
                    this.focus >= 2 && context.player.opponent.deck.length === 0,
                target: {
                    autoTarget: (context) => context.player.opponent.phoenixborn,
                    gameAction: ability.actions.dealDamage({
                        amount: 1
                    })
                },
                message: '{0} uses {1} to deal 1 damage to {3}',
                messageArgs: (context) => context.player.opponent.phoenixborn
            }
        });
    }
}

SummonOrchidDove.id = 'summon-orchid-dove';

module.exports = SummonOrchidDove;
