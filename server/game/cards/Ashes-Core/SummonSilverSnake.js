const { Level, Magic, Location } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSilverSnake extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'spellboard',
            effect: ability.effects.spellGuard()
        });

        this.action({
            title: 'Summon Silver Snake',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Power, Magic.Charm),
                    new DiceCount(1, Level.Power, Magic.Natural)
                ])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'silver-snake',
                location: Location.Archives,
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                gameAction: ability.actions.addStatusToken((context) => ({
                    amount: context.source.focus,
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

SummonSilverSnake.id = 'summon-silver-snake';

module.exports = SummonSilverSnake;
