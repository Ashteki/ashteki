const AspectCard = require("../../../solo/AspectCard");

class ChargingHorde extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
        this.hordeAttack();

        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
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
