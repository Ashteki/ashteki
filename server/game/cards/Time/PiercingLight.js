const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class PiercingLight extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.dieUpgrades.some((die) => die.magic === Magic.Divine),
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }
}

PiercingLight.id = 'piercing-light';

module.exports = PiercingLight;
