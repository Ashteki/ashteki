const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SharedSorrow extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                discard: {
                    promptTitle: 'Shared Sorrow',
                    activePromptTitle: 'Discard 1 card from your hand with a magic play cost of 1 or more',
                    location: 'hand',
                    controller: 'self',
                    cardCondition: (card) => card.magicCost >= 1,
                    gameAction: ability.actions.discard()
                },
                return: {
                    dependsOn: 'discard',
                    activePromptTitle: 'Choose a card to place into your hand',
                    location: 'discard',
                    controller: 'self',
                    cardCondition: (card, context) =>
                        card.magicCost === context.targets.discard.magicCost,
                    gameAction: ability.actions.moveCard({ destination: 'hand' })
                }
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount:
                            context.preThenEvent.context.targets.discard &&
                            context.preThenEvent.context.targets.discard.magicCost
                    }))
                }
            }
        });
    }
}

SharedSorrow.id = 'shared-sorrow';

module.exports = SharedSorrow;
