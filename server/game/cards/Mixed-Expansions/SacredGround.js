const Card = require('../../Card.js');
const { Costs } = require('../../costs.js');

class SacredGround extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacred Ground',
            cost: [Costs.sideAction(), Costs.exhaust()],
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
