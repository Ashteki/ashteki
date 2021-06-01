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
            gameAction: ability.actions.summon({
                conjuration: 'glow-finch'
            })
        });
    }
}

LeoSunshadow.id = 'leo-sunshadow';

module.exports = LeoSunshadow;
