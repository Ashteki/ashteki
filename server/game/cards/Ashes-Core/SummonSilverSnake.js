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
            gameAction: ability.actions.summon({
                conjuration: 'silver-snake'
            }),
            then: {
                gameAction: ability.actions.addStatusToken((context) => ({
                    amount: context.source.focus,
                    target: context.preThenEvent.childEvent.card
                }))
            }
        });
    }
}

SummonSilverSnake.id = 'summon-silver-snake';

module.exports = SummonSilverSnake;
