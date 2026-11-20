const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class EmptyVessel extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Solemnity 1',
            condition: (context) => context.player.hand.length === 0,
            effect: 'place 1 exhaustion token on {1}',
            effectArgs: (context) => context.target,
            target: {
                showCancel: true,
                activePromptTitle: 'Choose a unit to exhaust',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

EmptyVessel.id = 'empty-vessel';

module.exports = EmptyVessel;
