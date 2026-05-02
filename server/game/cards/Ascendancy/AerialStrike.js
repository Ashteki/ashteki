const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class AerialStrike extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to deal 4 damage to',
                showCancel: true,
                CardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            }
        });
    }

    playWarning(context) {
        if (!context.player.phoenixborn.isAirborne) {
            return 'Your phoenixborn does not have an astral die on it.';
        }
    }
}

AerialStrike.id = 'aerial-strike';

module.exports = AerialStrike;
