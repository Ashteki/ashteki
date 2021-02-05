const Card = require('../../Card.js');

class PowerThrough extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.gainAbility('destroysFighting', {
                    // overkill 1
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: 1,
                        target: context.player.opponent.phoenixborn
                    }))
                })
            ]
        });
    }
}

PowerThrough.id = 'power-through';

module.exports = PowerThrough;
