const AspectCard = require("../../../solo/AspectCard");

class Heartpierce extends AspectCard {
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
                mode: 'auto',
                aim: 'right',
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            },

        });
    }

}

Heartpierce.id = 'heartpierce';

module.exports = Heartpierce;
