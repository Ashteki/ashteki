const { CardType } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class BallisticSeeds extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            when: {
                onLoseStatusCost: (event, context) => {
                    return [CardType.Aspect, CardType.ConjuredAspect].includes(event.card.type);
                }
            },
            target: {
                player: 'opponent',
                targetsPlayer: true,
                controller: 'opponent',
                cardCondition: (card, context) =>
                    card.type === CardType.Phoenixborn || this.checkRightmost(card, context),
                gameAction: ability.actions.addDamageToken({ amount: 1, showMessage: true })
            }
        });
    }

    checkRightmost(card, context) {
        return card.owner.isRightmost(card);
    }
}

BallisticSeeds.id = 'ballistic-seeds';

module.exports = BallisticSeeds;
