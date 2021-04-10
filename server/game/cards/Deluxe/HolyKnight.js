const Card = require('../../Card.js');

class HolyKnight extends Card {
    setupCardAbilities(ability) {
        // magic armour
        this.persistentEffect({
            condition: () => !this.exhausted,
            effect: ability.effects.spellGuard()
        });
    }
}

HolyKnight.id = 'holy-knight';

module.exports = HolyKnight;
