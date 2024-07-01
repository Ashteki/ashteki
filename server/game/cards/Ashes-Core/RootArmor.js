const Card = require('../../Card.js');

class RootArmor extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyLife(1)
        });

        this.whileAttached({
            condition: () => !this.parent.isBlank(),
            effect: ability.effects.modifyArmor(1)
        });
    }

    get botTarget() {
        return 'mine';
    }
}

RootArmor.id = 'root-armor';

module.exports = RootArmor;
