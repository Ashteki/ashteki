const AspectCard = require("../../../solo/AspectCard");

class Unbreakable extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        // withdraw
        this.persistentEffect({
            condition: () => this.exhausted,
            effect: ability.effects.preventAllDamage('Withdraw')
        });
    }
}

Unbreakable.id = 'unbreakable';

module.exports = Unbreakable;
