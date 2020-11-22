const { Level, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class NoahRedmoon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shadow Target',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            target: {
                // target a ready spell, or if no units then the pb is valid
                cardType: [CardType.ReadySpell],
                cardCondition: (card) => !card.exhausted,
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

NoahRedmoon.id = 'noah-redmoon';

module.exports = NoahRedmoon;
