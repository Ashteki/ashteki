const Card = require('../../Card.js');

class BlackCoil extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyAttack(() => this.getAbilityNumeric(-this.controller.handSize))
        });
    }
}

BlackCoil.id = 'black-coil';

module.exports = BlackCoil;