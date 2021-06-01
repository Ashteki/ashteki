const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonEmperorLion extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Emperor Lion',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(2, Level.Class, Magic.Divine),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'emperor-lion'
            })
        });
    }
}

SummonEmperorLion.id = 'summon-emperor-lion';

module.exports = SummonEmperorLion;
