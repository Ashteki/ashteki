const Card = require('../../Card.js');

class WillToSurvive extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.modifyLife(1),
                ability.effects.gainAbility('afterDestroysFighting', {
                    autoResolve: true,
                    gameAction: ability.actions.removeDamage((context) => ({
                        target: context.player.phoenixborn,
                        amount: context.source.getAbilityNumeric(1)
                    }))
                })
            ]
        });
    }
}

WillToSurvive.id = 'will-to-survive';

module.exports = WillToSurvive;
