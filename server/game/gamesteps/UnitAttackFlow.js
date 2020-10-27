const { BattlefieldTypes } = require('../../constants');
const Costs = require('../costs');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const SimpleStep = require('./simplestep');

class UnitAttackFlow extends BaseStepWithPipeline {
    constructor(game, target = null) {
        super(game);
        this.battle = {
            type: 'unit',
            targetUnit: target,
            attacker: null,
            guard: null,
            counter: false
        };
        const attackingPlayer = this.game.activePlayer;
        const defendingPlayer = this.battle.targetUnit.controller;

        let steps = [];
        if (!this.battle.targetUnit) {
            steps.push(new SimpleStep(this.game, () => this.declareTargetUnit(attackingPlayer)));
        }
        steps = steps.concat([
            new SimpleStep(this.game, () => this.declareAttacker(attackingPlayer)),
            new SimpleStep(this.game, () => this.payAttackCost(attackingPlayer)),
            new SimpleStep(this.game, () => this.chooseGuard(defendingPlayer)),
            new SimpleStep(this.game, () => this.promptForCounter(defendingPlayer)),
            new SimpleStep(this.game, () => this.resolveBattle()),
            new SimpleStep(this.game, () => this.exhaustParticipants())
        ]);

        this.pipeline.initialise(steps);
    }

    payAttackCost(attackingPlayer) {
        const costEvent = Costs.mainAction().payEvent(
            this.game.getFrameworkContext(attackingPlayer)
        );
        this.game.openEventWindow(costEvent);
    }

    exhaustParticipants() {
        let participants = [this.battle.attacker];
        if (this.battle.guard) {
            participants.push(this.battle.guard);
        } else if (this.battle.counter) {
            participants.push(this.battle.targetUnit);
        }

        this.game.actions
            .exhaust()
            .resolve(participants, this.game.getFrameworkContext(this.game.activePlayer));
    }

    resolveBattle() {
        let params = {
            card: this.battle.targetUnit,
            context: this.game.getFrameworkContext(this.game.activePlayer),
            condition: (event) =>
                event.attacker.location === 'play area' && event.card.location === 'play area',
            attacker: this.battle.attacker,
            attackerClone: this.battle.attacker.createSnapshot(),
            attackerTarget: this.battle.guard ? this.battle.guard : this.battle.targetUnit,
            defenderTarget: this.battle.attacker,
            destroyed: [],
            battle: this.battle
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
                // event.battle.type == 'unit' &&
                (event.battle.counter || event.battle.guard) &&
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
                if (this.battle.guard) {
                    let guardEvent = this.game.getEvent('onGuardDamage', {
                        guard: this.battle.guard
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

    chooseGuard(defendingPlayer) {
        if (!defendingPlayer.defenders.some((c) => c.canGuard())) return true;

        let event = this.game.getEvent('onGuardSelect', {}, () => {
            this.game.promptForSelect(defendingPlayer, {
                optional: true,
                activePromptTitle: 'Guard?',
                waitingPromptTitle: 'Waiting for opponent to choose guard...',
                controller: 'self',
                cardType: [...BattlefieldTypes, 'Phoenixborn'],
                cardCondition: (card) => card.canGuard() && card !== this.battle.targetUnit,
                onSelect: (player, card) => {
                    this.battle.guard = card;

                    return true;
                }
            });
        });

        this.game.openEventWindow([event]);
    }

    promptForCounter(defendingPlayer) {
        if (this.battle.guard) {
            return true;
        }

        this.game.promptWithHandlerMenu(defendingPlayer, {
            title: 'Do you want to counter?',
            mode: 'select',
            choices: ['Yes', 'No'],
            handlers: [() => (this.battle.counter = true), () => (this.battle.counter = false)]
        });
    }

    declareAttacker(attackingPlayer) {
        let event = this.game.getEvent('onAttackerDeclared', {}, () => {
            this.game.promptForSelect(attackingPlayer, {
                activePromptTitle: 'Select an attacker',
                controller: 'self',
                cardType: [...BattlefieldTypes],
                onSelect: (player, card) => {
                    this.battle.attacker = card;
                    return true;
                }
            });
        });
        this.game.openEventWindow([event]);
    }

    declareTargetUnit(attackingPlayer) {
        this.game.promptForSelect(attackingPlayer, {
            activePromptTitle: 'Select a target unit',
            controller: 'opponent',
            cardType: [...BattlefieldTypes],
            onSelect: (player, card) => {
                this.battle.targetUnit = card;
                return true;
            }
        });
        this.game.raiseEvent('onTargetDeclared', this.battle);
    }
}

module.exports = UnitAttackFlow;
