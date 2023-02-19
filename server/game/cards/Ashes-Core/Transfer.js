const { CardType, PhoenixbornTypes } = require('../../../constants.js');
const { capitalize } = require('../../../util.js');
const Card = require('../../Card.js');

class Transfer extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Transfer',
            targetsPlayer: true,
            targets: {
                tokenBoy: {
                    targetsPlayer: true,
                    ignoreTargetCheck: true,
                    activePromptTitle: 'Choose a card with tokens',
                    controller: 'any',
                    cardCondition: (card) =>
                        card.hasAnyTokens() && !PhoenixbornTypes.includes(card.type)
                },
                amount: {
                    activePromptTitle: 'Choose a type',
                    dependsOn: 'tokenBoy',
                    mode: 'select',
                    choices: (context) => this.getTokenOptions(context.targets.tokenBoy),
                    choiceHandler: (option) => (this.chosenType = option.value)
                },
                receiver: {
                    ignoreTargetCheck: true,
                    activePromptTitle: 'Choose a card to receive the token',
                    dependsOn: 'amount',
                    cardCondition: (card, context) =>
                        !PhoenixbornTypes.includes(card.type) &&
                        card.controller === context.targets.tokenBoy.controller &&
                        card !== context.targets.tokenBoy,
                    gameAction: ability.actions.moveToken((context) => ({
                        from: context.targets.tokenBoy,
                        to: context.targets.receiver,
                        type: this.chosenType
                    }))
                }
            }
        });
    }

    getTokenOptions(card) {
        return Object.keys(card.tokens).map((t) => ({ text: capitalize(t), value: t }));
    }
}

Transfer.id = 'transfer';

module.exports = Transfer;
