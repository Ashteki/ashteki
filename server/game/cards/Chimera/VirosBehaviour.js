const { Level } = require('../../../constants');
const AbilityDsl = require('../../abilitydsl');
const Behaviour = require('../../solo/Behaviour');
const BehaviourCard = require('../../solo/BehaviourCard');

class VirosBehaviour extends BehaviourCard {
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
                                main: 'Reveal',
                                side: 'Target opposing player must lower 2 non-basic dice in their active pool one level'
                            },
                            () => {
                                // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                                this.doLowerOpponentsDice();
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Raise 1 basic rage die one level\n Main: Reveal'
                            },
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise();
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
                                main: 'Reveal',
                                side: "Deal 1 damage to the opposing player's target phoenixborn"
                            },
                            () => {
                                // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                                this.doPbBurnDamage(1);
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Raise 2 basic rage die one level\n Main: Reveal'
                            },
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise(2);
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
                                main: 'Reveal',
                                side: "Deal 1 damage to the opposing player's leftmost target unit"
                            },
                            () => {
                                // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                                this.doUnitBurnDamage(1, 'left');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Raise 3 basic rage die one level\n Main: Reveal'
                            },
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise(3);
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

    doLowerOpponentsDice() {
        if (this.owner.opponent.activeNonBasicDiceCount === 0) {
            return;
        }

        const ability = this.behaviour({
            title: 'Chimera Behaviour',
            target: {
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: Math.min(2, this.owner.opponent.activeNonBasicDiceCount),
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            },
            message: '{0} uses {1} to lower 2 opponent dice'
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

VirosBehaviour.id = 'viros-behaviour';

module.exports = VirosBehaviour;
