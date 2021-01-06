const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class LeoSunshadow extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Glow Finch',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'glow-finch',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

LeoSunshadow.id = 'leo-sunshadow';

module.exports = LeoSunshadow;
