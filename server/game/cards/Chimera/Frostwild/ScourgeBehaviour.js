const { Level } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');

class ScourgeBehaviour extends BehaviourCard {
    getBehaviour(behaviourRoll, phase) {
        switch (phase) {
            case 1:
                switch (behaviourRoll) {
                    case 1:
                    case 2:
                        return new Behaviour(behaviourRoll, { main: 'Reveal.' }, () => this.doReveal());
                    case 3:
                    case 4:
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Attack, if able. If not, Reveal.' },
                            () => (this.canAttack() ? this.doAttack() : this.doReveal())
                        );
                    case 5:
                    case 6:
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with revealed aspect.' },
                            () => this.doAttack(this.doReveal())
                        );
                    case 7:
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal. Attach a Vigor conjured alteration spell to revealed aspect'
                            },
                            () => {
                                // Main: Reveal, attach a vigor alt to the revealed
                                this.doVigor(this.doReveal());
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Stun conjured alteration spell to opponents rightmost unit'
                            },
                            () => {
                                // Side: stun
                                this.doStun('right');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 12:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Place 1 Red Rains token on the Chimera'
                            },
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.doAddRedRains();
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    default:
                        throw new Error('Unexpected behaviour roll');
                }
            case 2:
                switch (behaviourRoll) {
                    case 1:
                        return new Behaviour(behaviourRoll, { main: 'Reveal.' }, () => this.doReveal());
                    case 2:
                    case 3:
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Attack, if able. If not, Reveal.' },
                            () => (this.canAttack() ? this.doAttack() : this.doReveal())
                        );
                    case 4:
                    case 5:
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with revealed aspect.' },
                            () => this.doAttack(this.doReveal())
                        );
                    case 6:
                    case 7:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal. Attach a Vigor conjured alteration spell to revealed aspect'
                            },
                            () => {
                                // Main: Reveal, attach a vigor alt to the revealed
                                this.doVigor(this.doReveal());
                            }
                        );
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Deal 1 damage to all exhausted opponent units and pb'
                            },
                            () => {
                                // Side: Aoe damage to all exhausted units and pb.
                                this.doAoEDamage(1, true);
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Stun conjured alteration spell to opponents rightmost unit'
                            },
                            () => {
                                // Side: stun
                                this.doStun('right');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 12:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Place 1 Red Rains token on the Chimera'
                            },
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.doAddRedRains();
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    default:
                        throw new Error('Unexpected behaviour roll');
                }
            case 3:
                switch (behaviourRoll) {
                    case 1:
                    case 2:
                    case 3:
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Attack, if able. If not, Reveal.' },
                            () => (this.canAttack() ? this.doAttack() : this.doReveal())
                        );
                    case 4:
                    case 5:
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with revealed aspect.' },
                            () => this.doAttack(this.doReveal())
                        );
                    case 6:
                    case 7:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal. Attach a Vigor conjured alteration spell to revealed aspect'
                            },
                            () => {
                                // Main: Reveal, attach a vigor alt to the revealed
                                this.doVigor(this.doReveal());
                            }
                        );
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Opponent may lower 2 non-basic dice one level, or take 1 pb damage'
                            },
                            () => {
                                // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                                this.doEnforcedLowerOpponentsDice();
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Stun conjured alteration spell to opponents rightmost unit'
                            },
                            () => {
                                // Side: stun
                                this.doStun('right');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 12:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Place 1 Red Rains token on the Chimera'
                            },
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.doAddRedRains();
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    default:
                        throw new Error('Unexpected behaviour roll');
                }
            default:
                throw new Error('Unexpected chimera phase (behaviour)');
        }
    }

    doVigor(aspect) {
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
            target: {
                autoTarget: () => aspect,
                gameAction: AbilityDsl.actions.attachConjuredAlteration({
                    conjuredAlteration: 'vigor'
                })
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doStun(aim) {
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
            target: {
                mode: 'auto',
                cardCondition: (card) => !card.exhausted,
                aim: aim,
                gameAction: AbilityDsl.actions.attachConjuredAlteration({
                    conjuredAlteration: 'stun'
                })
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doAoEDamage(amount, includePb) {
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => {
                    const targets = [...context.player.opponent.unitsInPlay];
                    if (includePb) {
                        targets.push(context.player.opponent.phoenixborn);
                    }
                    return targets.filter((t) => t.exhausted);
                },
                gameAction: AbilityDsl.actions.orderedAoE({
                    gameAction: AbilityDsl.actions.dealDamage({ amount: amount, showMessage: true })
                })
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doEnforcedLowerOpponentsDice() {
        if (this.owner.opponent.activeNonBasicDiceCount === 0) {
            return;
        }

        const ability = this.behaviour({
            title: 'Chimera Behaviour',
            cost: AbilityDsl.costs.sideAction(),
            target: {
                activePromptTitle: 'Choose 2 dice to lower, or take 1 pb damage',
                optional: true,
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: 2,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvent.context.diceChangeCount !== 2,
                target: {
                    autoTarget: (context) => context.player.opponent.phoenixborn,
                    gameAction: AbilityDsl.actions.dealDamage({
                        amount: 1,
                        showMessage: true
                    })
                }
            },
            message: '{0} uses {1} to lower 2 opponent dice'
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

ScourgeBehaviour.id = 'scourge-behaviour';

module.exports = ScourgeBehaviour;
