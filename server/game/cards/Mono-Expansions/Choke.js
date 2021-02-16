const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Choke extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !context.source.exhausted,
            title: 'Choke',
            target: {
                cardType: CardType.Phoenixborn,
                controller: 'opponent',
                cardCondition: (card) => !card.exhausted,
                gameAction: [ability.actions.dealDamage(), ability.actions.exhaust()]
            }
        });
    }
}

Choke.id = 'choke';

module.exports = Choke;
