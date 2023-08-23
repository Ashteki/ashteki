const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class JungleForager extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Armed',
            target: {
                activePromptTitle: 'Choose an alteration to place in your hand',
                optional: true,
                cardType: CardType.Upgrade,
                controller: 'self',
                cardCondition: (card) => !card.phoenixborn,
                location: 'deck',
                gameAction: ability.actions.moveCard({
                    destination: 'hand',
                    shuffle: true
                })
            }
        });
    }
}

JungleForager.id = 'jungle-forager';

module.exports = JungleForager;
