const Card = require('../../Card.js');

class SonicSwordsman extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.afterDestroysFighting({
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
