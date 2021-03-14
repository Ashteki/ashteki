const Card = require('../../Card.js');

class SacredGround extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacred Ground',
            location: 'spellboard',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.player.unitsInPlay,
                duration: 2,
                durationType: 'turn',
                effect: ability.effects.modifyArmor(1)
            }))
        });
    }
}

SacredGround.id = 'sacred-ground';

module.exports = SacredGround;
