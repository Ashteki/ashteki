const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class LordswallUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        switch (phase) {
            case 1:
            case 2:
                return this.ultimate({
                    effect: 'deal {0} damage to all opponent units',
                    effectArgs: () => phase,
                    target: {
                        ignoreTargetCheck: true,
                        autoTarget: (context) => context.player.opponent.unitsInPlay,
                        gameAction: AbilityDsl.actions.orderedAoE({
                            gameAction: AbilityDsl.actions.dealDamage({
                                amount: phase,
                                showMessage: true
                            }),
                            promptTitle: 'Chimera Ultimate'
                        })
                    },
                    then: {
                        gameAction: AbilityDsl.actions.summon({
                            conjuration: 'rainwalker',
                            count: 2
                        })
                    }
                });
            case 3:
                return this.ultimate({
                    gameAction: AbilityDsl.actions.summon({
                        conjuration: 'rainwalker',
                        count: 3
                    })
                });
        }
    }
}

LordswallUltimate.id = 'lordswall-ultimate';

module.exports = LordswallUltimate;
