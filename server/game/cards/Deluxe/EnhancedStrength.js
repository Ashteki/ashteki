const Card = require('../../Card.js');

class EnhancedStrength extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.modifyLife(1),
                ability.effects.gainAbility('forcedInterrupt', {
                    inexhaustible: true,
                    title: 'Endurance',
                    when: {
                        onRoundEnded: () => true
                    },
                    gameAction: ability.actions.removeExhaustion({ all: true })
                })
            ]
        });
    }
}

EnhancedStrength.id = 'enhanced-strength';

module.exports = EnhancedStrength;
