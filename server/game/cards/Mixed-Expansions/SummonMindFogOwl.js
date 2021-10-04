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
            gameAction: ability.actions.summon({
                conjuration: 'mind-fog-owl'
            }),
            then: {
                condition: (context) =>
                    context.source.focus > 0 &&
                    context.preThenEvent.context.costs.returnDice.some((d) => d.level === 'power'),
                target: {
                    activePromptTitle: 'Focus: Choose target for Charm power die',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    optional: true,
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
