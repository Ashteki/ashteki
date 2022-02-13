const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class RaywardKnight extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'To Arms',
            target: {
                mode: 'upTo',
                numCards: 1,
                activePromptTitle: 'Choose up to 1 ally to shuffle into your deck',
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

        //Charge
    }
}

RaywardKnight.id = 'rayward-knight';

module.exports = RaywardKnight;