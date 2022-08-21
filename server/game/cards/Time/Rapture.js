const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Rapture extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Rapture',
            target: {
                activePromptTitle: 'Choose a unit to destroy',
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    ignoreTargetCheck: true,
                    autoTarget: (context) => context.player.opponent.unitsInPlay,
                    gameAction: ability.actions.orderedAoE({
                        gameAction: ability.actions.dealDamage({ showMessage: true }),
                        promptTitle: 'Rapture'
                    })
                }
            }
        });
    }
}

Rapture.id = 'rapture';

module.exports = Rapture;
