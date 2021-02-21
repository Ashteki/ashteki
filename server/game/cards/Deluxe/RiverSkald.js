const Card = require('../../Card.js');

class RiverSkald extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw(),
            then: {
                // effect: 'deal 1 damage to {1}',
                // effectArgs: (context) => context.target,
                targets: {
                    discard: {
                        activePromptTitle: 'Harsh Melody',
                        optional: true,
                        location: 'hand',
                        controller: 'self',
                        gameAction: ability.actions.discard()
                    },
                    victim: {
                        dependsOn: 'discard',
                        activePromptTitle: 'Choose a damage target',
                        gameAction: ability.actions.dealDamage((context) => ({
                            amount: context.targets.discard.magicCost
                        }))
                    }
                }
            }
        });
    }
}

RiverSkald.id = 'river-skald';

module.exports = RiverSkald;
