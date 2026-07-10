const AspectCard = require("../../../solo/AspectCard");

class Heartpierce extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
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
