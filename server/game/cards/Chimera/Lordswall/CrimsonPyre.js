const { CardType, BattlefieldTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class CrimsonPyre extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                mode: 'auto',
                aim: 'right',
                controller: 'self',
                cardType: CardType.ConjuredAspect,
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.preThenEvent?.context.target,
                    trueGameAction: ability.actions.allocateDamage((context) => ({
                        choosingPlayer: context.player.opponent,
                        controller: 'opponent',
                        numSteps: 2,
                        cardType: [...BattlefieldTypes, CardType.Phoenixborn]
                    }))
                })
            }
        });
    }
}

CrimsonPyre.id = 'crimson-pyre';

module.exports = CrimsonPyre;
