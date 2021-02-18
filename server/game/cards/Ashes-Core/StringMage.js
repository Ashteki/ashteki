const { BattlefieldTypes } = require('../../../constants.js');
const { capitalize } = require('../../../util.js');
const Card = require('../../Card.js');

class StringMage extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Exchange Link',
            cost: [ability.costs.sideAction()],
            targets: {
                tokenBoy: {
                    activePromptTitle: 'Choose a unit with wound or status tokens',
                    controller: 'any',
                    cardType: BattlefieldTypes,
                    cardCondition: (card) => card.hasToken('status') || card.hasToken('damage')
                },
                amount: {
                    activePromptTitle: 'Choose a type',
                    dependsOn: 'tokenBoy',
                    mode: 'options',
                    options: (context) => this.getTokenOptions(context.targets.tokenBoy),
                    handler: (option) => (this.chosenType = option.value)
                },
                receiver: {
                    activePromptTitle: 'Choose a card to receive the token',
                    dependsOn: 'amount',
                    cardType: BattlefieldTypes,
                    cardCondition: (card, context) => {
                        // if it's from this card, then to is not this card
                        if (context.targets.tokenBoy === context.source) {
                            return card != context.source;
                        } else return card === context.source; // else to this card
                    },
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
        return Object.keys(card.tokens)
            .filter((t) => ['status', 'damage'].includes(t))
            .map((t) => ({ name: capitalize(t), value: t }));
    }
}

StringMage.id = 'string-mage';

module.exports = StringMage;
