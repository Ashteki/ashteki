const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonRuinDweller extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Ruin Dweller',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Class, Magic.Time)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'ruin-dweller'
            })
        });
    }
}

SummonRuinDweller.id = 'summon-ruin-dweller';

module.exports = SummonRuinDweller;
