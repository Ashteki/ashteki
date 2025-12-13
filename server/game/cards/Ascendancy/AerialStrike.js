const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class AerialStrike extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.phoenixborn.isAirborne,
            target: {
                activePromptTitle: 'Choose a unit to deal 4 damage to',
                showCancel: true,
                CardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            }
        });
    }
}

AerialStrike.id = 'aerial-strike';

module.exports = AerialStrike;
