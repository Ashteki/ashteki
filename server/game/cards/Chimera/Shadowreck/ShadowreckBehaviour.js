const { Level, BattlefieldTypes, CardType, PhoenixbornTypes } = require('../../../../constants');
const AbilityDsl = require('../../../abilitydsl');
const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');
const SplitBehaviour = require('../../../solo/SplitBehaviour');

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
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal. Attack with revealed aspect.',
                                side: 'Raise 1 basic rage die one level'
                            },
                            () => this.doAttack(this.doReveal()),
                            () => {
                                // Side: Raise 1 basic rage die one level
                                this.doRageRaise();
                            }
                        );
                    case 7:
                    case 8:
                    case 9:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Target opposing player must lower 1 non-basic dice in their active pool one level'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: Target opposing player must lower 1 non-basic dice in their active pool one level.
                                this.doLowerOpponentsDice(1);
                            }
                        );
                    case 10:
                    case 11:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Webbed conjured alteration spell to opponents leftmost non-webbed unit'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: webbed
                                this.doWebbed('left');

                            }
                        );
                    case 12:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Place 1 Red Rains token on the Chimera'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.doAddRedRains();
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
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                side: 'Target opposing player must place 1 wound token on their Phoenixborn or leftmost unit',
                                main: 'Reveal. Attack with revealed aspect.'
                            },
                            () => this.doAttack(this.doReveal()),
                            () => {
                                // side:
                                this.doPbOrLeftmostBurn();
                            }
                        );
                    case 7:
                    case 8:
                    case 9:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Target opposing player must lower 2 non-basic dice in their active pool one level'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                                this.doLowerOpponentsDice(2);
                            }
                        );
                    case 10:
                    case 11:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                side: 'Attach a Webbed conjured alteration spell to opponents leftmost non-webbed unit',
                                main: 'Reveal'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: web
                                this.doWebbed('left');
                            }
                        );
                    case 12:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Place 1 Red Rains token on the Chimera'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.doAddRedRains();
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
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                side: 'Target opposing player must place 1 exhaustion token on a Phoenixborn or ready spell they control',
                                main: 'Reveal. Attack with revealed aspect.'
                            },
                            () => {
                                this.doAttack(this.doReveal());
                            },
                            () => {
                                this.doPbOrReadySpellExhaustion();
                            }
                        );
                    case 7:
                    case 8:
                    case 9:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                side: 'Target opposing player must lower 3 non-basic dice in their active pool one level.',
                                main: 'Reveal'
                            },
                            () => this.doReveal(),

                            () => {
                                // Side: Target opposing player must lower 3 non-basic dice in their active pool one level.
                                this.doLowerOpponentsDice(3);
                            }
                        );
                    case 10:
                    case 11:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal',
                                side: 'Attach a Webbed conjured alteration spell to opponents leftmost unit'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: web
                                this.doWebbed('left');
                            }
                        );

                    case 12:
                        return new SplitBehaviour(
                            behaviourRoll,
                            {
                                main: 'Reveal.',
                                side: 'Place 1 Red Rains token on the Chimera'
                            },
                            () => this.doReveal(),
                            () => {
                                // Side: Place 1 Red Rains token on the Chimera.
                                this.doAddRedRains();
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

    doPbOrLeftmostBurn() {
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
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
            cost: AbilityDsl.costs.sideAction(),
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
