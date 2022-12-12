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
                cardCondition: (card) => !card.exhausted,
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

    playWarning(context) {
        const unexhaustedAllies = context.player.unitsInPlay.filter(
            (u) => u.type === CardType.Ally && !u.exhausted
        );
        if (unexhaustedAllies.length === 0) {
            return 'You dont have any unexhausted allies';
        }
        return '';
    }
}

Rapture.id = 'rapture';

module.exports = Rapture;
