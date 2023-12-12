const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EternityFlame extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                cardCondition: (card) => card.hasCharmDie,
                activePromptTitle: 'Choose a unit with a charm die to destroy',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    autoTarget: (context) => context.player.opponent.phoenixborn,
                    gameAction: ability.actions.dealDamage({
                        amount: 2,
                        showMessage: true
                    })
                }
            }
        });
    }
}

EternityFlame.id = 'eternity-flame';

module.exports = EternityFlame;
