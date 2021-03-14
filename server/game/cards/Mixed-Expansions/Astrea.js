const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Astrea extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Beguile',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            target: {
                cardType: BattlefieldTypes,
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

Astrea.id = 'astrea';

module.exports = Astrea;
