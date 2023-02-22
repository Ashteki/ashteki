const AspectCard = require("../../solo/AspectCard");

class Firebelly extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => [...context.player.opponent.unitsInPlay, context.player.opponent.phoenixborn],
                gameAction: ability.actions.dealDamage({ showMessage: true })
            }
        });
    }

}

Firebelly.id = 'firebelly';

module.exports = Firebelly