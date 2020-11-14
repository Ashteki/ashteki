const Card = require('../../Card.js');

class LivingDoll extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Pain Link',
            cost: [ability.costs.sideAction()],
            effect: 'move 1 damage to opponent phoenixborn',
            gameAction: [
                ability.actions.removeDamage((context) => ({
                    target: context.source
                })),
                ability.actions.addDamageToken((context) => ({
                    target: context.player.opponent.phoenixborn
                }))
            ]
        });
    }
}

LivingDoll.id = 'living-doll';

module.exports = LivingDoll;
