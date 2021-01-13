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
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'nightshade-swallow',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                may: 'force opponent to discard?',
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
