const { PhoenixbornTypes, BattlefieldTypes, Level } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class ScourgeUltimate extends UltimateCard {
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
                                ...context.player.opponent.unitsInPlay,
                                context.player.opponent.phoenixborn
                            ],
                            action: AbilityDsl.actions.attachConjuredAlteration({
                                targetType: [...BattlefieldTypes, ...PhoenixbornTypes],
                                conjuredAlteration: 'stun'
                            })
                        }))
                    }
                });
            case 2:
                return this.ultimate({
                    title: 'Ultimate',
                    gameAction: AbilityDsl.actions.dealDamage((context) => ({
                        target: context.player.opponent.phoenixborn,
                        amount: 3
                    })),
                    then: {
                        alwaysTriggers: true,
                        gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                            forEach: [
                                ...context.player.opponent.unitsInPlay,
                                context.player.opponent.phoenixborn
                            ],
                            action: AbilityDsl.actions.attachConjuredAlteration({
                                targetType: [...BattlefieldTypes, ...PhoenixbornTypes],
                                conjuredAlteration: 'stun'
                            })
                        }))
                    }
                });
            case 3:
                return this.ultimate({
                    title: 'Ultimate',
                    target: {
                        player: 'opponent',
                        // targetsPlayer: true,
                        toSelect: 'die',
                        // mode: 'exactly',
                        // numDice: Math.min(2, this.owner.opponent.activeNonBasicDiceCount),
                        dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                        owner: 'opponent',
                        gameAction: AbilityDsl.actions.removeDieFromGame(),
                    },
                    then: {
                        alwaysTriggers: true,
                        target: {
                            mode: 'auto',
                            cardCondition: (card) => !card.exhausted,
                            aim: 'left',
                            gameAction: AbilityDsl.actions.attachConjuredAlteration({
                                conjuredAlteration: 'stun'
                            })
                        }
                    }
                });
        }
    }
}

ScourgeUltimate.id = 'scourge-ultimate';

module.exports = ScourgeUltimate;
