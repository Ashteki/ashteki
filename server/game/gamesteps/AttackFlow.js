const { BattlefieldTypes, CardType } = require('../../constants');
const { Costs } = require('../costs');
const AttackState = require('./AttackState');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const ChooseDefendersPrompt = require('./ChooseDefendersPrompt');
const SimpleStep = require('./simplestep');

class AttackFlow extends BaseStepWithPipeline {
    constructor(game, target = null) {
        super(game);
        this.target = target;
        this.isPBAttack = target.type === CardType.Phoenixborn;
        this.attackingPlayer = this.game.activePlayer;
        this.defendingPlayer = target.controller;
        game.setAttackState(new AttackState(this.target, this.attackingPlayer));

        let steps = [];
        steps = steps.concat([
            new SimpleStep(this.game, () => this.declareAttackers()),
            new SimpleStep(this.game, () => this.payAttackCost(this.attackingPlayer)),
            // should choose blockers here as a player prompt
            new ChooseDefendersPrompt(this.game, this.attack),
            new SimpleStep(this.game, () => {
                this.attack.battles.forEach((battle) => {
                    // this.game.queueSimpleStep(() => this.chooseBlockOrGuard(battle));
                    // the rest are fight resolution
                    this.game.queueSimpleStep(() => this.promptForCounter(battle));
                    this.game.queueSimpleStep(() => this.resolveBattle(battle));
                    this.game.queueSimpleStep(() => this.exhaustParticipants(battle));
                });
            }),
            new SimpleStep(this.game, () => this.clearAttackStatuses())
        ]);

        this.pipeline.initialise(steps);
    }

    get attack() {
        return this.game.attackState;
    }

    clearAttackStatuses() {
        this.game.clearAttackState();
        this.attack.battles.forEach((battle) => {
            battle.attacker.isAttacker = false;
            if (battle.guard) battle.guard.isDefender = false;
        });
    }

    payAttackCost(attackingPlayer) {
        let attackers = this.attack.battles.map((b) => b.attacker);
        this.game.addAlert(
            'danger',
            '{0} attacks {1} with {2}',
            attackingPlayer,
            this.target,
            attackers
        );

        const costEvent = Costs.mainAction().payEvent(
            this.game.getFrameworkContext(attackingPlayer)
        );
        this.game.openEventWindow(costEvent);
    }

    exhaustParticipants(battle) {
        let participants = [battle.attacker];
        // if there's a guard or blocker, they counter and so exhaust
        // otherwise if the target counters (was not guarded or blocked) they exhaust
        if (
            battle.guard &&
            battle.guard.type !== CardType.Phoenixborn &&
            battle.guard.exhaustsOnCounter()
        ) {
            participants.push(battle.guard);
        } else if (battle.counter && battle.target.exhaustsOnCounter()) {
            participants.push(battle.target);
        }
        // phoenixborn don't exhaust, but are marked as having guarded this round
        if (battle.guard && battle.guard.type === CardType.Phoenixborn) {
            this.game.actions
                .setGuarded()
                .resolve(battle.guard, this.game.getFrameworkContext(this.game.activePlayer));
        }

        this.game.actions
            .exhaust()
            .resolve(participants, this.game.getFrameworkContext(this.game.activePlayer));
    }

    resolveBattle(battle) {
        let params = {
            card: battle.target,
            context: this.game.getFrameworkContext(this.game.activePlayer),
            condition: (event) =>
                event.attacker.location === 'play area' && event.card.location === 'play area',
            attacker: battle.attacker,
            attackerClone: battle.attacker.createSnapshot(),
            attackerTarget: battle.guard ? battle.guard : battle.target,
            defenderTarget: battle.attacker,
            destroyed: [],
            battle: battle
        };

        this.game.raiseEvent('onFight', params, (event) => {
            let defenderAmount = event.card.attack;
            if (event.card.anyEffect('limitFightDamage')) {
                defenderAmount = Math.min(
                    defenderAmount,
                    ...event.card.getEffects('limitFightDamage')
                );
            }

            let defenderParams = {
                amount: defenderAmount,
                fightEvent: event,
                damageSource: event.card
            };

            let attackerAmount =
                event.attacker.attack + event.attacker.getBonusDamage(event.attackerTarget);
            if (event.attacker.anyEffect('limitFightDamage')) {
                attackerAmount = Math.min(
                    attackerAmount,
                    ...event.attacker.getEffects('limitFightDamage')
                );
            }

            let attackerParams = {
                amount: attackerAmount,
                fightEvent: event,
                damageSource: event.attacker
            };

            let damageEvent;
            if (
                // The attacker is still the defender's target (this could be switched in beforeFight interrupts?)
                event.defenderTarget === event.attacker &&
                event.battle.counter &&
                // don't counter damage if the attacker strikes first and the damage will destroy the defender
                !(event.attacker.attacksFirst() && attackerAmount >= event.attackerTarget.life) &&
                event.card.checkRestrictions('dealFightDamage') && // declared target can deal damage
                event.attackerTarget.checkRestrictions('dealFightDamageWhenDefending') // or defender can't deal damage when defending
            ) {
                // Counter damage event
                damageEvent = this.game.actions
                    .dealDamage(defenderParams)
                    .getEvent(event.defenderTarget, event.context);
            }

            // if attacker CAN dealFightDamage
            if (event.attacker.checkRestrictions('dealFightDamage')) {
                let attackerDamageEvent = this.game.actions
                    .dealDamage(attackerParams)
                    .getEvent(event.attackerTarget, event.context);

                // if there's a guard then trigger the onGuardDamageEvent
                if (battle.guard) {
                    let guardEvent = this.game.getEvent('onGuardDamage', {
                        guard: battle.guard
                    });
                    guardEvent.addChildEvent(attackerDamageEvent);
                    attackerDamageEvent = guardEvent;
                }

                // if there is damage from the defender
                if (damageEvent) {
                    // append this to the existing COUNTER event
                    damageEvent.addChildEvent(attackerDamageEvent);
                } else {
                    // there's not COUNTER event, so set to be the damageEvent
                    damageEvent = attackerDamageEvent;
                }
            }

            // If anyone is getting damaged...
            if (damageEvent) {
                // mark as fighting
                event.card.isFighting = true;
                event.attacker.isFighting = true;
                this.game.checkGameState(true); // ?? to check for pre-fight damage / deaths?
                damageEvent.openReactionWindow = false; // this damage event doesn't trigger reaction opportunities
                this.game.openEventWindow(damageEvent); // ?? err...
                this.game.queueSimpleStep(() => {
                    // add a new event to fire the damage event and
                    event.addChildEvent(damageEvent);
                    damageEvent.openReactionWindow = true;
                    event.card.isFighting = false;
                    event.attacker.isFighting = false;
                });
            }
        });
    }

    // chooseBlockOrGuard(battle) {
    //     // exit if there are no eligeable blockers / guarders?
    //     if (!this.blockersAvailable(battle) || battle.attacker.hasKeyword('bypass')) {
    //         return true;
    //     }

    //     let event = this.game.getEvent('onGuardSelect', {}, () => {
    //         this.game.promptForSelect(this.defendingPlayer, {
    //             source: battle.attacker,
    //             optional: true,
    //             activePromptTitle: this.isPBAttack ? 'Choose a blocker' : 'Choose a guard?',
    //             waitingPromptTitle: this.isPBAttack
    //                 ? 'Waiting for opponent to block'
    //                 : 'Waiting for opponent to guard',
    //             controller: 'self',
    //             cardType: [...BattlefieldTypes, 'Phoenixborn'],
    //             cardCondition: (card) => {
    //                 return this.availableToBlockOrGuard(card, battle);
    //             },
    //             onSelect: (player, card) => {
    //                 battle.guard = card;

    //                 return true;
    //             }
    //         });
    //     });

    //     this.game.openEventWindow([event]);
    // }

    blockersAvailable(battle) {
        return this.defendingPlayer.defenders.some((c) => this.availableToBlockOrGuard(c, battle));
    }

    availableToBlockOrGuard(c, battle) {
        return (
            this.guardTest(c, battle.target, battle.attacker) || this.blockTest(c, battle.attacker)
        );
    }

    guardTest(card, target, attacker) {
        return !this.isPBAttack && card.canGuard(attacker) && card !== target;
    }

    blockTest(card, attacker) {
        return (
            this.isPBAttack &&
            !this.attack.battles.some((b) => b.guard == card) &&
            card.canBlock(attacker)
        );
    }

    promptForCounter(battle) {
        // battle.guard here holds a blocker or a guard
        if (battle.guard) {
            this.game.addAlert(
                'warning',
                this.isPBAttack ? '{0} blocks {1} with {2}' : '{0} guards against {1} with {2}',
                this.defendingPlayer,
                battle.attacker,
                battle.guard
            );

            // if it's not a pb guard then counter
            battle.counter = battle.guard.type !== CardType.Phoenixborn;
            return true;
        }

        if (this.isPBAttack || battle.target.exhausted) {
            // don't ask to counter with phoenixborn (they don't have an attack value)
            // and exhausted targets cannot counter
            battle.counter = false;
            return true;
        }

        this.game.promptWithHandlerMenu(this.defendingPlayer, {
            activePromptTitle: 'Do you want to counter?',
            mode: 'select',
            choices: ['Yes', 'No'],
            handlers: [() => (battle.counter = true), () => (battle.counter = false)]
        });
    }

    declareAttackers() {
        const params = {
            attackingPlayer: this.attackingPlayer,
            battles: this.attack.battles
        };
        let event = this.game.getEvent('onAttackersDeclared', params, () => {
            this.game.promptForSelect(this.attackingPlayer, {
                activePromptTitle: this.isPBAttack ? 'Select attackers' : 'Select an attacker',
                source: this.target,
                controller: 'self',
                cardType: [...BattlefieldTypes],
                cardCondition: (card) => !card.exhausted,
                mode: this.isPBAttack ? 'unlimited' : 'single',
                onSelect: (player, card) => {
                    let cards;
                    if (Array.isArray(card)) {
                        cards = card;
                    } else {
                        cards = [card];
                    }
                    cards.forEach((c) => {
                        this.attack.battles.push({
                            attacker: c,
                            target: this.target,
                            guard: null,
                            counter: false
                        });
                        c.isAttacker = true;
                    });

                    return true;
                }
            });
        });
        this.game.openEventWindow([event]);
    }
}

module.exports = AttackFlow;
