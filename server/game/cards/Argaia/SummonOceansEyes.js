const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonOceansEyes extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: "Summon Ocean's Eyes",
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Basic)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'oceans-eyes',
                count: 2
            })
        });
    }
}

SummonOceansEyes.id = 'summon-oceans-eyes';

module.exports = SummonOceansEyes;
