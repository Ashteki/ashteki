const { BattlefieldTypes } = require('../../constants');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const SimpleStep = require('./simplestep');

class UnitAttackFlow extends BaseStepWithPipeline {
    constructor(game, target = null) {
        super(game);
        this.battle = {
            targetUnit: target,
            attacker: null,
            guard: null
        };

        let steps = [];
        if (!this.battle.targetUnit) {
            steps.push(new SimpleStep(this.game, () => this.declareTargetUnit()));
        }
        steps = steps.concat([
            new SimpleStep(this.game, () => this.declareAttacker()),
            new SimpleStep(this.game, () => this.chooseGuard()),
            new SimpleStep(this.game, () => this.resolveBattle()),
            new SimpleStep(this.game, () => this.exhaustAttacker())
        ]);

        this.pipeline.initialise(steps);
    }
    exhaustAttacker() {
        this.game.actions
            .exhaust()
            .resolve(this.battle.attacker, this.game.getFrameworkContext(this.game.activePlayer));
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
            destroyed: []
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
                // if there is damage from the defender
                if (damageEvent) {
                    // append this to the existing COUNTER event
                    damageEvent.addChildEvent(
                        this.game.actions
                            .dealDamage(attackerParams)
                            .getEvent(event.attackerTarget, event.context)
                    );
                } else {
                    // there's not COUNTER event, so set to be the damageEvent
                    damageEvent = this.game.actions
                        .dealDamage(attackerParams)
                        .getEvent(event.attackerTarget, event.context);
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

    chooseGuard() {
        if (!this.game.activePlayer.opponent.cardsInPlay.some((c) => c.canGuard())) return false;

        let event = this.game.getEvent('onGuardSelected', {}, () => {
            this.game.promptForSelect(this.game.activePlayer.opponent, {
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

    declareTargetUnit() {
        this.game.promptForSelect(this.game.activePlayer, {
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

    declareAttacker() {
        let event = this.game.getEvent('onAttackerDeclared', {}, () => {
            this.game.promptForSelect(this.game.activePlayer, {
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
}

module.exports = UnitAttackFlow;
