const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Retreat extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Retreat',
            target: {
                activePromptTitle: 'Choose an exhausted ally to return to hand',
                controller: 'self',
                optional: true,
                cardType: CardType.Ally,
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.returnToHand({
                    upgradeDestination: 'hand'
                })
            }
        });
    }
}

Retreat.id = 'retreat';

module.exports = Retreat;
