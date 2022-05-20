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
                let defenderAmount = event.attackerTarget.attack;
                if (event.card.anyEffect('limitFightDamage')) {
                    defenderAmount = Math.min(
                        defenderAmount,
                        ...event.card.getEffects('limitFightDamage')
                    );
                }

                let defenderParams = {
                    amount: defenderAmount,
                    fightEvent: event,
                    damageSource: event.card,
                    showMessage: true
                };

                let attackerAmount = event.attacker.exhausted
                    ? 0
                    : event.attacker.attack + event.attacker.getBonusDamage(event.attackerTarget);
                if (event.attacker.anyEffect('limitFightDamage')) {
                    attackerAmount = Math.min(
                        attackerAmount,
                        ...event.attacker.getEffects('limitFightDamage')
                    );
                }

                let attackerParams = {
                    amount: attackerAmount,
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

                if (
                    defenderParams.amount > 0 &&
                    // The attacker is still the defender's target (this could be switched in beforeFight interrupts?)
                    event.defenderTarget === event.attacker &&
                    event.battle.counter &&
                    event.card.checkRestrictions('dealFightDamage') && // declared target can deal damage
                    event.attackerTarget.checkRestrictions('dealFightDamageWhenDefending') // or defender can't deal damage when defending
                ) {
                    // Counter damage event
                    const counterDamageEvent = context.game.actions
                        .dealDamage(defenderParams)
                        .getEvent(event.defenderTarget, event.context);

                    event.counterDamageEvent = counterDamageEvent;
                    if (damageEvent) {
                        damageEvent.addChildEvent(counterDamageEvent);
                    } else {
                        damageEvent = counterDamageEvent;
                    }
                }

                // If anyone is getting damaged...
                if (damageEvent) {
                    context.game.openEventWindow(damageEvent);
                }

                this.battle.resolved = true;
            })
        );
    }

    // damageWillDestroyTarget(attackerAmount, target) {
    //     let amountReceived = attackerAmount;
    //     if (target.anyEffect('multiplyDamage')) {
    //         amountReceived = amountReceived * target.sumEffects('multiplyDamage');
    //     }
    //     return amountReceived + target.damage - target.armor >= target.life;
    // }

    getEventArray() {
        return this.events;
    }
}

module.exports = ResolveBattleAction;
