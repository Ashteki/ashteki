const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ReclaimSoul extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to destroy',
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.removeDamage((context) => ({
                    target: context.player.phoenixborn,
                    amount: 2,
                    showMessage: true
                }))
            }
        });
    }
}

ReclaimSoul.id = 'reclaim-soul';

module.exports = ReclaimSoul;
