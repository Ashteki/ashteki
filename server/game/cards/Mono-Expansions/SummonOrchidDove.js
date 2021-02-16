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
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'orchid-dove',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                alwaysTriggers: true,
                may: 'deal 1 damage to opponents PB?',
                condition: (context) =>
                    this.focus === 2 && context.player.opponent.deck.length === 0,
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.player.opponent.phoenixborn
                }))
            }
        });
    }
}

SummonOrchidDove.id = 'summon-orchid-dove';

module.exports = SummonOrchidDove;
