const Card = require('../../Card.js');

class SacredGround extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacred Ground',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.player.unitsInPlay,
                effect: ability.effects.modifyArmor(1),
                until: {
                    onBeginTurn: (event) => event.player === context.player
                }
            }))
        });
    }
}

SacredGround.id = 'sacred-ground';

module.exports = SacredGround;
