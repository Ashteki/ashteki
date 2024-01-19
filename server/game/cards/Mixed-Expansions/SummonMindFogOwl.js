const { Level, Magic } = require('../../../constants.js');
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
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.focus > 0 &&
                    context.priorContext.costs.returnDice.some(
                        (d) => d.level === Level.Power && d.magic === Magic.Charm
                    ),
                gameAction: this.game.actions.resolveDieAbility((context) => ({
                    target: context.priorContext.costs.returnDice.find(
                        (d) => d.level === Level.Power && d.magic === Magic.Charm
                    )
                }))
            }
        });
    }
}

SummonMindFogOwl.id = 'summon-mind-fog-owl';

module.exports = SummonMindFogOwl;
