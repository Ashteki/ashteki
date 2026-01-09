const { PhoenixbornTypes, BattlefieldTypes, Level } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class MoonCoveUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        switch (phase) {
            case 1:
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
                        target: {
                            autoTarget: (context) => context.player.opponent.phoenixborn,

                            gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                                num: 2,
                                action: AbilityDsl.actions.attachConjuredAlteration({
                                    target: context.target,
                                    targetType: PhoenixbornTypes,
                                    conjuredAlteration: 'drowning'
                                })
                            }))
                        }
                    }
                });
            case 2:
                return this.ultimate({
                    title: 'Ultimate',
                    target: {
                        ignoreTargetCheck: true,
                        autoTarget: (context) => context.player.opponent.unitsInPlay,
                        gameAction: AbilityDsl.actions.orderedAoE({
                            gameAction: AbilityDsl.actions.dealDamage({ amount: phase, showMessage: true }),
                            promptTitle: 'Chimera Ultimate'
                        })
                    },
                    then: {
                        alwaysTriggers: true,
                        target: {
                            autoTarget: (context) => context.player.opponent.phoenixborn,

                            gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                                num: 2,
                                action: AbilityDsl.actions.attachConjuredAlteration({
                                    target: context.target,
                                    targetType: PhoenixbornTypes,
                                    conjuredAlteration: 'drowning'
                                })
                            }))
                        }
                    }
                });
            case 3:
                return this.ultimate({
                    title: 'Ultimate',
                    target: {
                        autoTarget: (context) => context.player.opponent.phoenixborn,
                        gameAction: AbilityDsl.actions.dealDamage({ amount: 1, showMessage: true })
                    },
                    then: {
                        alwaysTriggers: true,
                        gameAction: AbilityDsl.actions.addToThreatZone({ amount: 1 })
                    }
                });
        }
    }
}

MoonCoveUltimate.id = 'moon-cove-ultimate';

module.exports = MoonCoveUltimate;
