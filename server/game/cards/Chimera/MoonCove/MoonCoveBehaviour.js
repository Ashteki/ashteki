const { CardType } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');

class MoonCoveBehaviour extends BehaviourCard {
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
                                side: 'Re-roll 2 basic rage dice'
                            },
                            () => {
                                // Side: reroll 2 basic rage dice.
                                this.doBasicRageReroll(2);
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
                                side: 'Attach a Drowning conjured alteration spell to opponents phoenixborn'
                            },
                            () => {
                                // Side: bleed
                                this.doDrowning();
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
                                side: "Deal 1 damage to the opposing player's leftmost target unit"
                            },
                            () => {
                                // Side: Deal 1 damage to the opposing player's leftmost target unit.
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
                                main: 'Reveal',
                                side: 'Attach a Drowning conjured alteration spell to opponents phoenixborn'
                            },
                            () => {
                                // Side: bleed
                                this.doDrowning();
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
                    case 4:
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Attack, if able. If not, Reveal.' },
                            () => (this.canAttack() ? this.doAttack() : this.doReveal())
                        );
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with revealed aspect.' },
                            () => this.doAttack(this.doReveal())
                        );
                    case 9:
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Drowning conjured alteration spell to opponents phoenixborn'
                            },
                            () => {
                                // Side: bleed
                                this.doDrowning();
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

    doDrowning() {
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: AbilityDsl.actions.attachConjuredAlteration({
                    conjuredAlteration: 'drowning',
                    targetType: CardType.Phoenixborn
                })
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

MoonCoveBehaviour.id = 'moon-cove-behaviour';

module.exports = MoonCoveBehaviour;
