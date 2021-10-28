const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class SonicSwordsman extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.afterDestroysFighting({
            target: {
                optional: true,
                activePromptTitle: 'Sonic Pulse 1',
                waitingPromptTitle: 'Sonic Pulse 1: waiting for opponent',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

SonicSwordsman.id = 'sonic-swordsman';

module.exports = SonicSwordsman;
