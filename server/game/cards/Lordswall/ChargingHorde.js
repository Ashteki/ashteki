const AspectCard = require("../../solo/AspectCard");

class ChargingHorde extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
        this.hordeAttack();

        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker'
            })
        });
    }

}

ChargingHorde.id = 'charging-horde';

module.exports = ChargingHorde;
