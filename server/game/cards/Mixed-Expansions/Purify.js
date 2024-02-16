const { CardType, AspectTypes } = require('../../../constants.js');
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
                    context.player.opponent.unitsInPlay.some(
                        (card) => card.isConjuration()
                    ),
                target: {
                    activePromptTitle: 'Choose a conjuration to destroy',
                    controller: 'opponent',
                    cardType: [CardType.Conjuration, ...AspectTypes],
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

Purify.id = 'purify';

module.exports = Purify;
