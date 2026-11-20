const Card = require('../../Card.js');

class MachBike extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.modifyLife(2),
                ability.effects.quickStrike()
            ]
        });
    }
}

MachBike.id = 'mach-bike';

module.exports = MachBike;
