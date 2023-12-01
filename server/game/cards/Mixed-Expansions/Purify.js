const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Purify extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Purify',
            target: {
                activePromptTitle: 'Choose an ally to return to hand',
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: ability.actions.returnToHand()
            },
            then: {
                condition: (context) =>
                    context.player.opponent.battlefield.some(
                        (card) => card.isConjuration()
                    ),
                target: {
                    activePromptTitle: 'Choose a conjuration to destroy',
                    controller: 'opponent',
                    cardType: [CardType.Conjuration, CardType.Aspect],
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

Purify.id = 'purify';

module.exports = Purify;
