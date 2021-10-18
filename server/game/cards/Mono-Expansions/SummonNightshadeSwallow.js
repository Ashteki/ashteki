const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonNightshadeSwallow extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Nightshade Swallow',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Class, Magic.Charm)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'nightshade-swallow'
            }),
            then: {
                alwaysTriggers: true,
                may: 'force your opponent to discard the top card of their deck',
                condition: (context) =>
                    this.focus &&
                    context.player.dice.filter((d) => !d.exhausted).length <
                    context.player.opponent.dice.filter((d) => !d.exhausted).length,
                gameAction: ability.actions.discardTopOfDeck()
            }
        });
    }
}

SummonNightshadeSwallow.id = 'summon-nightshade-swallow';

module.exports = SummonNightshadeSwallow;
