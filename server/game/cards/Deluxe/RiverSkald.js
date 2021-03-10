const Card = require('../../Card.js');

class RiverSkald extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.draw(),
            then: {
                // effect: 'deal 1 damage to {1}',
                // effectArgs: (context) => context.target,
                targets: {
                    discard: {
                        activePromptTitle: 'Choose a card to discard',
                        optional: true,
                        location: 'hand',
                        controller: 'self',
                        gameAction: ability.actions.discard()
                    },
                    victim: {
                        dependsOn: 'discard',
                        activePromptTitle: 'Choose a damage target',
                        gameAction: ability.actions.dealDamage((context) => ({
                            amount: context.targets.discard && context.targets.discard.magicCost
                        }))
                    }
                },
                message: '{0} discards {3} to deal {4} damage to {5}',
                messageArgs: (context) => [
                    context.targets.discard,
                    context.targets.discard.magicCost,
                    context.targets.victim
                ]
            }
        });
    }
}

RiverSkald.id = 'river-skald';

module.exports = RiverSkald;
