const AbilityDsl = require('../../../abilitydsl');
const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');

class NeversetBehaviour extends BehaviourCard {
    getBehaviour(behaviourRoll, phase) {
        switch (phase) {
            case 1:
                switch (behaviourRoll) {
                    case 1:
                    case 2:
                    case 3:
                        return new Behaviour(behaviourRoll, { main: 'Reveal.' }, () => this.doReveal());
                    case 4:
                    case 5:
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Attack, if able. If not, Reveal.' },
                            () => (this.canAttack() ? this.doAttack() : this.doReveal())
                        );

                    case 6:
                    case 7:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Raise 1 basic rage die one level'
                            },
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise();
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'resolve status ability',
                                mainFirst: true
                            },
                            () => {
                                // Main: Reveal
                                this.doReveal();
                                this.useStatusAbility('right');
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Bleed conjured alteration spell to opponents leftmost unit'
                            },
                            () => {
                                // Side: bleed
                                this.doBleed('left');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 12:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Scarlet Seed if able, else place 1 Red Rains token on the Chimera'
                            },
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.owner.canSummon('scarlet-seed')
                                    ? this.doSummon('scarlet-seed')
                                    : this.doAddRedRains();
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
                    case 7:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Raise 2 basic rage die one level'
                            },
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise(2);
                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'resolve status ability',
                                mainFirst: true
                            },
                            () => {
                                // Main: Reveal
                                this.doReveal();
                                this.useStatusAbility('right');
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Bleed conjured alteration spell to opponents leftmost unit'
                            },
                            () => {
                                // Side: bleed
                                this.doBleed('left');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 12:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Scarlet Seed if able, else place 1 Red Rains token on the Chimera'
                            },
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.owner.canSummon('scarlet-seed')
                                    ? this.doSummon('scarlet-seed')
                                    : this.doAddRedRains();
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
                    case 7:
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with revealed aspect.' },
                            () => this.doAttack(this.doReveal())
                        );
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'resolve status ability',
                                mainFirst: true
                            },
                            () => {
                                // Main: Reveal
                                this.doReveal();
                                this.useStatusAbility('right');
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Bleed conjured alteration spell to opponents leftmost unit'
                            },
                            () => {
                                // Side: bleed
                                this.doBleed('left');
                                // Main: Reveal
                                this.doReveal();
                            }
                        );

                    case 12:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Scarlet Seed if able, else place 1 Red Rains token on the Chimera'
                            },
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.owner.canSummon('scarlet-seed')
                                    ? this.doSummon('scarlet-seed')
                                    : this.doAddRedRains();
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

    doBleed(aim) {
        const ability = this.behaviour({
            target: {
                mode: 'auto',
                aim: aim,
                gameAction: AbilityDsl.actions.attachConjuredAlteration({
                    conjuredAlteration: 'bleed'
                })
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    useStatusAbility(aim) {
        const ability = this.behaviour({
            target: {
                mode: 'auto',
                aim: aim,
                controller: 'self',
                cardCondition: (card) => card.status > 0 && card.hasStatusAbility,
                gameAction: AbilityDsl.actions.resolveStatusAbility((context) => ({
                    ability: context.target?.getStatusAbility()
                }))
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

NeversetBehaviour.id = 'neverset-behaviour';

module.exports = NeversetBehaviour;
