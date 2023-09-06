const AbilityDsl = require('../../abilitydsl');
const UltimateCard = require('../../solo/UltimateCard');

class VirosUltimate extends UltimateCard {
    getUltimateAbility(phase) {
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
                    promptTitle: 'One Hundred Blades'
                })
            }
        });
    }
}

VirosUltimate.id = 'viros-ultimate';

module.exports = VirosUltimate;
