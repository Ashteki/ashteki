const Card = require('../../Card.js');

class ShiningHydraHead extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ terrifying: 1 }),
                ability.effects.modifyAttack(1),
                ability.effects.modifyRecover(1)
            ]
        });
    }
}

ShiningHydraHead.id = 'shining-hydra-head';

module.exports = ShiningHydraHead;
