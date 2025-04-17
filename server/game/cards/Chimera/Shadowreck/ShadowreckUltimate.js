const { PhoenixbornTypes, BattlefieldTypes, Level } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class ShadowreckUltimate extends UltimateCard {
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
                        gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                            forEach: [
                                ...context.player.opponent.unitsInPlay
                            ],
                            action: AbilityDsl.actions.attachConjuredAlteration({
                                targetType: BattlefieldTypes,
                                conjuredAlteration: 'webbed'
                            })
                        }))
                    }
                });
            case 2:
                return this.ultimate({
                    title: 'Ultimate',
                    gameAction: AbilityDsl.actions.dealDamage((context) => ({
                        target: context.player.opponent.phoenixborn,
                        amount: 3,
                        showMessage: true
                    })),
                    then: {
                        alwaysTriggers: true,
                        gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                            forEach: context.player.opponent.unitsInPlay,
                            action: AbilityDsl.actions.attachConjuredAlteration({
                                targetType: BattlefieldTypes,
                                conjuredAlteration: 'webbed'
                            })
                        }))
                    }
                });
            case 3:
                return this.ultimate({
                    title: 'Ultimate',
                    gameAction: AbilityDsl.actions.chosenDiscard({
                        location: ['hand', 'spellboard'],
                        allowTopOfDeck: true,
                        amount: 2
                    }),
                    then: {
                        alwaysTriggers: true,
                        gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                            forEach: context.player.opponent.unitsInPlay,
                            action: AbilityDsl.actions.attachConjuredAlteration({
                                targetType: BattlefieldTypes,
                                conjuredAlteration: 'webbed'
                            })
                        }))
                    }
                });
        }
    }
}

ShadowreckUltimate.id = 'shadowreck-ultimate';

module.exports = ShadowreckUltimate;
