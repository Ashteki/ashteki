const { Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class PiercingLight extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => BattlefieldTypes.includes(card.type) &&
                card.dieUpgrades.some((die) => die.magic === Magic.Divine),
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }
}

PiercingLight.id = 'piercing-light';

module.exports = PiercingLight;
