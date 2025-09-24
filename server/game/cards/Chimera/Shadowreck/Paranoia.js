const AspectCard = require("../../../solo/AspectCard");

class Paranoia extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            condition: () => !this.exhausted,
            targetController: 'opponent',

            effect: ability.effects.playerCannot(
                'useBasicDice'
            )
        });
    }
}

Paranoia.id = 'paranoia';

module.exports = Paranoia;
