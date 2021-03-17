const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class RevivalPact extends Card {
    setupCardAbilities(ability) {
        return this.play({
            title: 'Revival Pact',
            target: {
                mode: 'upTo',
                numCards: 3,
                controller: 'self',
                cardType: CardType.Ally,
                location: 'discard',
                gameAction: ability.actions.moveCard({ destination: 'deck' })
            },
            effect: 'move {0} from discard to their draw pile',
            then: {
                gameAction: ability.actions.shuffleDeck()
            }
        });
    }
}

RevivalPact.id = 'revival-pact';

module.exports = RevivalPact;
