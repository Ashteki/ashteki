const { BattlefieldTypes, EffectLocations } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShieldMage extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => BattlefieldTypes.includes(card.type) &&
                EffectLocations.includes(card.location), // my units
            effect: ability.effects.cannotBeAttackTarget()
        });
    }
}

ShieldMage.id = 'shield-mage';

module.exports = ShieldMage;
