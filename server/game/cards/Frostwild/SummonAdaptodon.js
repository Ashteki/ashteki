const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonAdaptodon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Adaptodon',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Class, Magic.Natural)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'adaptodon'
            })
        });
    }
}

SummonAdaptodon.id = 'summon-adaptodon';

module.exports = SummonAdaptodon;
