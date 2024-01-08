const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Farewell extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            target: {
                activePromptTitle: (context) =>
                    'Choose a unit with ' +
                    context.event.context.costs.returnDice.length +
                    ' life to discard',
                cardCondition: (card, context) =>
                    card.life === context.event.context.costs.returnDice.length,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.discard()
            },
            then: (context) => ({
                gameAction: ability.actions.discardTopOfDeck({
                    amount: context.event.context.costs.returnDice.length
                })
            })
        });
    }
}

Farewell.id = 'farewell';

module.exports = Farewell;
