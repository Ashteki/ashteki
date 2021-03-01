const Card = require('../../Card.js');

class HolyRelics extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(2), ability.effects.modifyLife(2)]
        });
    }
}

HolyRelics.id = 'holy-relics';

module.exports = HolyRelics;
