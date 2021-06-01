const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMajesticTitan extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Majestic Titan',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Charm),
                    new DiceCount(1, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'majestic-titan'
            })
        });
    }
}

SummonMajesticTitan.id = 'summon-majestic-titan';

module.exports = SummonMajesticTitan;
