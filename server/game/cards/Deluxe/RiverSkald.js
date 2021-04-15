const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RiverSkald extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.draw(),
            then: {
                may: 'discard a card to deal damage',
                cost: [ability.costs.chosenDiscard()],
                payCostsFirst: true,
                target: {
                    activePromptTitle: 'Choose a damage target',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount:
                            context.costs.discardedCards &&
                            context.costs.discardedCards[0].magicCost
                    }))
                },
                message: '{0} discards {3} to deal {4} damage to {5}',
                messageArgs: (context) => [
                    context.costs.discardedCards,
                    context.costs.discardedCards[0].magicCost,
                    context.target
                ]
            }
        });
    }
}

RiverSkald.id = 'river-skald';

module.exports = RiverSkald;
