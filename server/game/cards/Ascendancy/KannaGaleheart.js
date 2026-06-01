const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class KannaGaleheart extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Aeromancy',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            gameAction: [
                ability.actions.moveCard((context) => ({
                    showMessage: true,
                    destination: 'hand',
                    promptWithHandlerMenu: {
                        optional: true,
                        activePromptTitle: 'You may reveal an action spell and add it to your hand',
                        cards: context.player.deck.slice(0, 5),
                        condition: (card) => card.type === CardType.ActionSpell
                    }
                })),
                ability.actions.shuffleDeck()
            ],
            effect: 'look at the top 5 cards of their deck'
        });
    }
}

KannaGaleheart.id = 'kanna-galeheart';

module.exports = KannaGaleheart;
