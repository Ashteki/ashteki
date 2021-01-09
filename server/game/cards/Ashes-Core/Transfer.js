const { CardType } = require('../../../constants.js');
const { capitalize } = require('../../../util.js');
const Card = require('../../Card.js');

class Transfer extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Transfer',
            targets: {
                tokenBoy: {
                    controller: 'any',
                    cardCondition: (card) =>
                        card.hasAnyTokens() && card.type !== CardType.Phoenixborn
                },
                amount: {
                    dependsOn: 'tokenBoy',
                    mode: 'options',
                    options: (context) => this.getTokenOptions(context.targets.tokenBoy),
                    handler: (option) => (this.chosenType = option.value)
                },
                receiver: {
                    dependsOn: 'amount',
                    cardCondition: (card, context) =>
                        card.type !== CardType.Phoenixborn &&
                        card.controller === context.targets.tokenBoy.controller,
                    gameAction: [
                        ability.actions.removeToken((context) => ({
                            target: context.targets.tokenBoy,
                            type: this.chosenType
                        })),
                        ability.actions.addToken(() => ({
                            type: this.chosenType
                        }))
                    ]
                }
            }
        });
    }

    getTokenOptions(card) {
        return Object.keys(card.tokens).map((t) => ({ name: capitalize(t), value: t }));
    }
}

Transfer.id = 'transfer';

module.exports = Transfer;
