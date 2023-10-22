const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class ScourgeUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        if (phase < 3) {
            return this.ultimate({
                effect: 'deal {0} damage to all opponent units and phoenixborn',
                effectArgs: () => phase,
                target: {
                    ignoreTargetCheck: true,
                    autoTarget: (context) => [
                        ...context.player.opponent.unitsInPlay,
                        context.player.opponent.phoenixborn
                    ],
                    gameAction: AbilityDsl.actions.orderedAoE({
                        gameAction: AbilityDsl.actions.dealDamage({ amount: phase, showMessage: true }),
                        promptTitle: 'Chimera Ultimate'
                    })
                }
            });
        } else {
            return this.ultimate({
                gameAction: AbilityDsl.actions.addToThreatZone({ amount: 1 })
            });
        }
    }
}

ScourgeUltimate.id = 'scourge-ultimate';

module.exports = ScourgeUltimate;
