const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Excavate extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Excavate',
            gameAction: ability.actions.discardTopOfDeck((context) => ({
                target: context.player,
                amount: 3
            })),
            then: {
                condition: (context) =>
                    context.preThenEvent.context.discardedCards &&
                    context.preThenEvent.context.discardedCards.length === 3,
                target: {
                    activePromptTitle: 'Choose a card to place in your hand',
                    cardCondition: (card, context) =>
                        context.preThenEvent.context.discardedCards.includes(card),
                    location: 'discard',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand({
                        location: 'discard',
                        showMessage: true
                    })
                },
                then: {
                    alwaysTriggers: true,
                    target: {
                        cardType: BattlefieldTypes,
                        activePromptTitle: 'Choose a unit to deal 3 damage to',
                        gameAction: ability.actions.dealDamage({
                            amount: 3
                        })
                    }
                }
            }
        });
    }
}

Excavate.id = 'excavate';

module.exports = Excavate;
