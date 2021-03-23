const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMindFogOwl extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.action({
            title: 'Summon Mind Fog Owl',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Charm),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'mind-fog-owl',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.context.costs.returnDice.some((d) => d.level === 'power'),
                target: {
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    cardCondition: (card) => !card.dieUpgrades.some((d) => d.magic === Magic.Charm),
                    gameAction: ability.actions.attachDie((context) => ({
                        upgradeDie: context.preThenEvent.context.costs.returnDice.find(
                            (d) => d.level === 'power'
                        )
                    }))
                }
            }
        });
    }
}

SummonMindFogOwl.id = 'summon-mind-fog-owl';

module.exports = SummonMindFogOwl;
