const { CardType, BattlefieldTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class CrimsonPyre extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                mode: 'auto',
                aim: 'right',
                controller: 'self',
                cardType: CardType.ConjuredAspect,
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvent?.context.target,
                target: {
                    toSelect: 'player',
                    autoTarget: (context) => context.player.opponent,
                    gameAction: ability.actions.sequentialDamage((context) => ({
                        cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                        numSteps: 2,
                        choosingPlayer: context.target,
                        allowRepeats: true
                    }))
                }
            }
        });
    }
}

CrimsonPyre.id = 'crimson-pyre';

module.exports = CrimsonPyre;
