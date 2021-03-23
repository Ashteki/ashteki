const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class MarkOfTheGoddess extends Card {
    setupCardAbilities(ability) {
        this.play({
            // preferActionPromptMessage: true,
            message: '{0} plays {1}',
            messageArgs: (context) => [context.player, context.source],
            target: {
                activePromptTitle: "Select an opponent's card for attack value",
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.conditional({
                    condition: (context) =>
                        context.target.controller.unitsInPlay.filter((c) => !c.exhausted).length ===
                        1,
                    trueGameAction: ability.actions.dealDamage((context) => ({
                        target: context.target.controller.phoenixborn,
                        amount: context.target.attack,
                        showMessage: true
                    })),
                    falseGameAction: ability.actions.dealDamage((context) => ({
                        promptForSelect: {
                            activePromptTitle: "Select another opponent's card to deal damage to",
                            cardType: BattlefieldTypes,
                            cardCondition: (card, context) =>
                                !card.exhausted && card !== context.target,
                            controller: 'opponent'
                        },
                        amount: context.target.attack,
                        showMessage: true
                    }))
                })
            }
        });
    }
}

MarkOfTheGoddess.id = 'mark-of-the-goddess';

module.exports = MarkOfTheGoddess;
