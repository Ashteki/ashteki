const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Botanist extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Nurture',
            cost: [ability.costs.sideAction()],
            target: {
                cardType: CardType.Conjuration,
                controller: 'self',
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'nurtured'
                })
            }
        });
    }
}

Botanist.id = 'botanist';

module.exports = Botanist;
