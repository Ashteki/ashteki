const { PhoenixbornTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class ShoreBreaker extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: 2,
                    action: ability.actions.attachConjuredAlteration({
                        target: context.target,
                        targetType: PhoenixbornTypes,
                        conjuredAlteration: 'drowning'
                    })
                }))
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.preThenEvent.context.cardsAttached < 2,
                    trueGameAction: ability.actions.dealDamage((context) => ({
                        target: context.player.opponent.phoenixborn
                    }))
                })
            }
        });
    }
}

ShoreBreaker.id = 'shore-breaker';

module.exports = ShoreBreaker