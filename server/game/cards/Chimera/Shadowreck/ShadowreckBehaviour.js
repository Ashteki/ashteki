const { Level, BattlefieldTypes, CardType, PhoenixbornTypes } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');

class ShadowreckBehaviour extends BehaviourCard {
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
                            {
                                main: 'Reveal. Attack with revealed aspect.',
                                side: 'Raise 1 basic rage die one level'
                            },
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise();
                                this.doAttack(this.doReveal());
                            }
                        );
                    case 7:
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Target opposing player must lower 1 non-basic dice in their active pool one level'
                            },
                            () => {
                                // Side: Target opposing player must lower 1 non-basic dice in their active pool one level.
                                this.doLowerOpponentsDice(1);

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
                                side: 'Attach a Webbed conjured alteration spell to opponents leftmost non-webbed unit'
                            },
                            () => {
                                // Side: webbed
                                this.doWebbed('left');
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
                    case 6:
                        // Side: Target opposing player must place 1 wound token on their Phoenixborn or leftmost unit
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            {
                                side: 'Target opposing player must place 1 wound token on their Phoenixborn or leftmost unit',
                                main: 'Reveal. Attack with revealed aspect.'
                            },
                            () => {
                                this.doPbOrLeftmostBurn();
                                this.doAttack(this.doReveal());
                            }
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
                                this.doLowerOpponentsDice(2);

                                // Main: Reveal
                                this.doReveal();
                            }
                        );
                    case 10:
                    case 11:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                side: 'Attach a Webbed conjured alteration spell to opponents leftmost non-webbed unit',
                                main: 'Reveal'
                            },
                            () => {
                                // Side: web
                                this.doWebbed('left');
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
                        return new Behaviour(
                            behaviourRoll,
                            { main: 'Attack, if able. If not, Reveal.' },
                            () => (this.canAttack() ? this.doAttack() : this.doReveal())
                        );
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        // Side: Target opposing player must place 1 exhaustion token on a Phoenixborn or ready spell they control
                        // Main: Reveal. Attack with revealed aspect
                        return new Behaviour(
                            behaviourRoll,
                            {
                                side: 'Target opposing player must place 1 exhaustion token on a Phoenixborn or ready spell they control',
                                main: 'Reveal. Attack with revealed aspect.'
                            },
                            () => {
                                this.doPbOrReadySpellExhaustion();
                                this.doAttack(this.doReveal());
                            }
                        );
                    case 7:
                    case 8:
                    case 9:
                        return new Behaviour(
                            behaviourRoll,
                            {
                                side: 'Target opposing player must lower 3 non-basic dice in their active pool one level.',
                                main: 'Reveal'
                            },
                            () => {
                                // Side: Target opposing player must lower 3 non-basic dice in their active pool one level.
                                this.doLowerOpponentsDice(3);
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
                                side: 'Attach a Webbed conjured alteration spell to opponents leftmost unit'
                            },
                            () => {
                                // Side: web
                                this.doWebbed('left');
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

    doWebbed(aim) {
        const ability = this.behaviour({
            target: {
                mode: 'auto',
                cardCondition: (card) => !card.anyEffect('webbed'),
                aim: aim,
                gameAction: AbilityDsl.actions.attachConjuredAlteration({
                    conjuredAlteration: 'webbed'
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

    doPbOrLeftmostBurn() {
        const ability = this.behaviour({
            target: {
                cardCondition: (card) =>
                    card.type === CardType.Phoenixborn || card.controller.isLeftmostUnit(card),
                activePromptTitle: 'Choose a target to be dealt 1 damage',
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                player: 'opponent',
                controller: 'opponent',
                gameAction: AbilityDsl.actions.dealDamage({
                    showMessage: true
                })
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }

    doPbOrReadySpellExhaustion() {
        const ability = this.behaviour({
            target: {
                cardType: [CardType.ReadySpell, ...PhoenixbornTypes],
                activePromptTitle: 'Choose a card to exhaust',
                player: 'opponent',
                controller: 'opponent',
                gameAction: AbilityDsl.actions.exhaust()
            }
        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

ShadowreckBehaviour.id = 'shadowreck-behaviour';

module.exports = ShadowreckBehaviour;
