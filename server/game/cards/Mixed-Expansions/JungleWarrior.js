const { BattlefieldTypes, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class JungleWarrior extends Card {
    setupCardAbilities(ability) {
        this.inheritance();

        this.destroyed({
            title: 'Last Orders 1',
            cost: ability.costs.dice([new DiceCount(1, Level.Basic)], 'Last Orders 1'),
            target: {
                activePromptTitle: 'Last Orders 1',
                optional: true,
                gameAction: ability.actions.removeExhaustion({
                    cardType: BattlefieldTypes
                })
            }
        });
    }
}

JungleWarrior.id = 'jungle-warrior';

module.exports = JungleWarrior;
