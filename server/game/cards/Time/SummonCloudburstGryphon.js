const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonCloudburstGryphon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Cloudburst Gryphon',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Divine),
                    new DiceCount(1, Level.Class, Magic.Time)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'cloudburst-gryphon'
            })
        });
    }
}

SummonCloudburstGryphon.id = 'summon-cloudburst-gryphon';

module.exports = SummonCloudburstGryphon;
