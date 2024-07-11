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
                // attack damage event to be queued later
                let damageEvent;
                let attackerAmountDealt = event.attacker.exhausted
                    ? 0
                    : event.attacker.attack + event.attacker.getBonusDamage(event.attackerTarget);
                if (attackerAmountDealt > 0) {
                    let attackerParams = {
                        amount: attackerAmountDealt,
                        fightEvent: event,
                        damageSource: event.attacker,
                        showMessage: true
                    };

                    let attackerDamageEvent = context.game.actions
                        .dealDamage(attackerParams)
                        .getEvent(event.attackerTarget, event.context);

                    event.attackerDamageEvent = attackerDamageEvent;
                    damageEvent = attackerDamageEvent;

                    // queue attacker damage
                    context.game.openEventWindow(damageEvent);
                }

                let defenderAmountDealt = event.attackerTarget.attack;
                if (defenderAmountDealt > 0 && event.battle.counter) {
                    // Counter damage event
                    let defenderParams = {
                        amount: defenderAmountDealt,
                        fightEvent: event,
                        damageSource: event.attackerTarget,
                        showMessage: true
                    };

                    const counterDamageEvent = context.game.actions
                        .dealDamage(defenderParams)
                        .getEvent(event.defenderTarget, event.context);

                    if (event.attacker.attacksFirst() || !damageEvent) {
                        // add as second event
                        context.game.openEventWindow(counterDamageEvent);
                    } else {
                        // add as child event for sim. resolution
                        damageEvent.addChildEvent(counterDamageEvent);
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
