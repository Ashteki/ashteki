const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShieldMage extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => BattlefieldTypes.includes(card.type), // my units
            effect: ability.effects.cannotBeAttackTarget()
        });
    }
}

ShieldMage.id = 'shield-mage';

module.exports = ShieldMage;
