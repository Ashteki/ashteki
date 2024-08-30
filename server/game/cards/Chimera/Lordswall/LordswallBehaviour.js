const { Level, BattlefieldTypes, CardType } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');

class LordswallBehaviour extends BehaviourCard {
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
                            { main: 'Reveal. Attack with rightmost aspect that can attack.' },
                            () => {
                                this.doReveal();
                                this.doAttack(null, 'right');
                            }
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
                                main: 'Reveal.',
                                side: 'Summon a Rainwalker'
                            },
                            () => {
                                // Side: summon a rainwalker.
                                this.doSummon('rainwalker');

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
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with rightmost aspect that can attack.' },
                            () => {
                                this.doReveal();
                                this.doAttack(null, 'right');
                            }
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
                                // Side: Target opposing player must place 1 wound on their pb or rightmost unit.
                                this.doChosenWoundPlacement();
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
                                side: 'Summon a Rainwalker'
                            },
                            () => {
                                // Side: summon a rainwalker.
                                this.doSummon('rainwalker');

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
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Reveal. Attack with rightmost aspect that can attack.' },
                            () => {
                                this.doReveal();
                                this.doAttack(null, 'right');
                            }
                        );
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Summon a Rainwalker'
                            },
                            () => {
                                // Side: summon a rainwalker.
                                this.doSummon('rainwalker');

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

    doChosenWoundPlacement() {
        const ability = this.behaviour({
            title: 'Chimera Behaviour',
            target: {
                cardCondition: (card) =>
                    card.type === CardType.Phoenixborn || card.controller.isRightmostUnit(card),
                activePromptTitle: 'Choose a target to be dealt 1 damage',
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                player: 'opponent',
                controller: 'opponent',
                gameAction: AbilityDsl.actions.addDamageToken()
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);

    }
}

LordswallBehaviour.id = 'lordswall-behaviour';

module.exports = LordswallBehaviour;
