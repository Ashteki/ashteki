const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSeasideRaven extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Seaside Raven',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(3, Level.Basic)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'seaside-raven',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonSeasideRaven.id = 'summon-seaside-raven';

module.exports = SummonSeasideRaven;
