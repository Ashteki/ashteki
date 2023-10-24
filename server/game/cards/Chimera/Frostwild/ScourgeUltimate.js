const { PhoenixbornTypes } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class ScourgeUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        if (phase < 3) {
            return this.ultimate({
                title: 'Ultimate',
                target: {
                    mode: 'auto',
                    // aim: 'left',
                    ignoreTargetCheck: true,
                    gameAction: AbilityDsl.actions.destroy()
                },
                then: {
                    alwaysTriggers: true,
                    gameAction: AbilityDsl.actions.attachConjuredAlteration((context) => ({
                        targetType: PhoenixbornTypes,
                        conjuredAlteration: 'stun',
                        target: context.player.opponent.phoenixborn
                    })),
                    then: {
                        alwaysTriggers: true,
                        gameAction: AbilityDsl.actions.attachConjuredAlteration((context) => ({
                            conjuredAlteration: 'stun',
                            target: context.player.opponent.unitsInPlay
                        }))
                    }
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
