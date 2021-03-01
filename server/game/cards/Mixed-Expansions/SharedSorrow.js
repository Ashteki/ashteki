const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SharedSorrow extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                discard: {
                    activePromptTitle: 'Shared Sorrow',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                },
                return: {
                    dependsOn: 'discard',
                    activePromptTitle: 'Choose a card to return',
                    location: 'discard',
                    controller: 'self',
                    cardCondition: (card, context) =>
                        card.magicCost === context.targets.discard.magicCost,
                    gameAction: ability.actions.moveCard({ destination: 'hand' })
                },
                victim: {
                    dependsOn: 'discard',
                    activePromptTitle: 'Choose a unit to damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.discard && context.targets.discard.magicCost
                    }))
                }
            }
        });
    }
}

SharedSorrow.id = 'shared-sorrow';

module.exports = SharedSorrow;
