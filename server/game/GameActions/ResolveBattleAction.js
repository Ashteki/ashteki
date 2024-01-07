const GameAction = require('./GameAction');

class ResolveBattleAction extends GameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.battle = null; // this should be populated from propertyFactory object merge (in super)
    }

    setup() {
        super.setup();
        this.name = 'Battle resolution';
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        this.events = [];

        const attackerTarget =
            this.battle.guard && this.battle.guard.isInPlay
                ? this.battle.guard
                : this.battle.target;

        let params = {
            card: this.battle.target,
            context: context,
            condition: (event) =>
                event.attacker.location === 'play area' && event.card.location === 'play area',
            attacker: this.battle.attacker,
            attackerClone: this.battle.attacker.createSnapshot(),
            attackerTarget: attackerTarget,
            defenderTarget: this.battle.attacker,
            destroyed: [],
            battle: this.battle
        };

        this.events.push(
            context.game.getEvent('onFight', params, (event) => {
                let defenderAmountDealt = event.attackerTarget.attack;
                if (event.attackerTarget.anyEffect('limitFightDamageDealt')) {
                    defenderAmountDealt = Math.min(
                        defenderAmountDealt,
                        ...event.attackerTarget.getEffects('limitFightDamageDealt')
                    );
                }

                let defenderParams = {
                    amount: defenderAmountDealt,
                    fightEvent: event,
                    damageSource: event.attackerTarget,
                    showMessage: true
                };

                let attackerAmountDealt = event.attacker.exhausted
                    ? 0
                    : event.attacker.attack + event.attacker.getBonusDamage(event.attackerTarget);
                if (event.attacker.anyEffect('limitFightDamageDealt')) {
                    attackerAmountDealt = Math.min(
                        attackerAmountDealt,
                        ...event.attacker.getEffects('limitFightDamageDealt')
                    );
                }

                let attackerParams = {
                    amount: attackerAmountDealt,
                    fightEvent: event,
                    damageSource: event.attacker,
                    showMessage: true
                };

                let damageEvent;

                // if attacker CAN dealFightDamage
                if (
                    event.attacker.checkRestrictions('dealFightDamage') &&
                    attackerParams.amount > 0
                ) {
                    let attackerDamageEvent = context.game.actions
                        .dealDamage(attackerParams)
                        .getEvent(event.attackerTarget, event.context);

                    event.attackerDamageEvent = attackerDamageEvent;
                    damageEvent = attackerDamageEvent;
                }

                let counterDamageEvent;
                if (
                    // quickstrike in a fight skips counter damage
                    !(
                        event.attacker?.attacksFirst() &&
                        this.damageWillDestroyTarget(event.attacker, attackerAmountDealt, event.card)
                    ) &&
                    defenderParams.amount > 0 &&
                    // The attacker is still the defender's target (this could be switched in beforeFight interrupts?)
                    event.defenderTarget === event.attacker &&
                    event.battle.counter &&
                    event.card.checkRestrictions('dealFightDamage') && // declared target can deal damage
                    event.attackerTarget.checkRestrictions('dealFightDamageWhenDefending') // or defender can't deal damage when defending
                ) {
                    // Counter damage event
                    counterDamageEvent = context.game.actions
                        .dealDamage(defenderParams)
                        .getEvent(event.defenderTarget, event.context);

                    event.counterDamageEvent = counterDamageEvent;
                    // if (damageEvent) {
                    //     damageEvent.addChildEvent(counterDamageEvent);
                    // } else {
                    //     damageEvent = counterDamageEvent;
                    // }
                }

                // If anyone is getting damaged...
                if (damageEvent) {
                    context.game.openEventWindow(damageEvent);
                }

                if (counterDamageEvent) {
                    if (event.attacker.attacksFirst() || !damageEvent) {
                        // add as second event
                        context.game.openEventWindow(counterDamageEvent);
                    } else {
                        // add as child event for sim. resolution
                        if (damageEvent) {
                            damageEvent.addChildEvent(counterDamageEvent);
                        }
                    }
                }

                this.battle.resolved = true;
            })
        );
    }

    damageWillDestroyTarget(attacker, attackAmount, target) {
        let amountReceived = attackAmount;
        if (target.anyEffect('multiplyDamage')) {
            amountReceived = amountReceived * target.sumEffects('multiplyDamage');
        }
        if (!attacker.anyEffect())
            if (target.anyEffect('limitDamageReceived')) {
                amountReceived = Math.min(
                    amountReceived,
                    ...target.getEffects('limitDamageReceived')
                );
            }
        return amountReceived + target.damage - target.armor >= target.life;
    }

    getEventArray() {
        return this.events;
    }
}

module.exports = ResolveBattleAction;
