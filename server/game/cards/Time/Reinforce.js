const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Reinforce extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reinforce',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            gameAction: [
                ability.actions.moveCard((context) => ({
                    showMessage: true,
                    destination: 'hand',
                    promptWithHandlerMenu: {
                        optional: true,
                        activePromptTitle: 'You may place an ally or alteration into your hand',
                        cards: context.player.deck.slice(0, 5),
                        condition: (card) => [CardType.Ally, CardType.Upgrade].includes(card.type)
                    }
                })),
                ability.actions.shuffleDeck()
            ],
            then: {
                may: 'play the card you drew?',
                condition: (context) => context.preThenEvent && context.preThenEvent.card,
                gameAction: ability.actions.playCard((context) => ({
                    target: context.preThenEvent.card,
                    ignoreActionCost: true
                }))
            }
        });
    }
}

Reinforce.id = 'reinforce';

module.exports = Reinforce;
