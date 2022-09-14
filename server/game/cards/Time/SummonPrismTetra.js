const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonPrismTetra extends Card {
    setupCardAbilities(ability) {
        this.spellGuard({
            location: 'spellboard'
        });

        this.action({
            title: 'Summon Prism Tetra',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Class, Magic.Sympathy)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'prism-tetra',
                count: 3
            }),
            then: {
                condition: (context) => context.source.focus >= 1,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.preThenEvent.cards,
                    until: {
                        onBeginTurn: (event) => event.player === context.player,
                        onBeginRound: () => true
                    },
                    effect: [
                        ability.effects.cannotBeSpellTarget(),
                        ability.effects.cannotBeAbilityTarget(),
                        ability.effects.cannotBeDicePowerTarget()
                    ]
                }))
            }
        });
    }
}

SummonPrismTetra.id = 'summon-prism-tetra';

module.exports = SummonPrismTetra;
