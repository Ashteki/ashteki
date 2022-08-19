const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonTidalCrab extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Tidal Crab',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Class, Magic.Time)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'tidal-crab'
            }),
            then: {
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.preThenEvent.cards,
                    amount: 2,
                    showMessage: true
                }))
            }
        });
    }
}

SummonTidalCrab.id = 'summon-tidal-crab';

module.exports = SummonTidalCrab;
