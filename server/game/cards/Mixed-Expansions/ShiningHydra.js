const Card = require('../../Card.js');

class ShiningHydra extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Regenerate Heads',
            cost: [ability.costs.sideAction()],
            gameAction: [
                ability.actions.removeDamage((context) => ({
                    target: context.source
                })),
                ability.actions.attachConjuredAlteration((context) => ({
                    conjuredAlteration: 'shining-hydra-head',
                    target: context.source
                }))
            ]
        });
    }
}

ShiningHydra.id = 'shining-hydra';

module.exports = ShiningHydra;
