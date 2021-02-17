const Card = require('../../Card.js');

class SonicSwordsman extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ alert: 1 })
        });

        this.destroysFighting({
            target: {
                activePromptTitle: 'Sonic Pulse 1',
                waitingPromptTitle: 'Sonic Pulse 1: waiting for opponent',
                cardType: ['Ally', 'Conjuration'],
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

SonicSwordsman.id = 'sonic-swordsman';

module.exports = SonicSwordsman;
