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

                if (event.battle.counter) {
                    // Counter damage event
                    if (event.attacker.attacksFirst() || !damageEvent) {
                        // e.g. quickstrike means do this as a later step
                        context.game.queueSimpleStep(() => {
                            // update target e.g. dread wraith
                            context.game.checkGameState(true);
                            context.game.openEventWindow(this.getCounterEvent(event, context));
                        });
                    } else {
                        // simultaneous resolution as default
                        damageEvent.addChildEvent(this.getCounterEvent(event, context));
                    }
                }

                this.battle.resolved = true;
            })
        );
    }

    getCounterEvent(event, context) {
        let defenderParams = {
            amount: event.attackerTarget.attack,
            fightEvent: event,
            damageSource: event.attackerTarget,
            showMessage: true
        };

        const counterDamageEvent = context.game.actions
            .dealDamage(defenderParams)
            .getEvent(event.defenderTarget, event.context);
        return counterDamageEvent;
    }

    getEventArray() {
        return this.events;
    }
}

module.exports = ResolveBattleAction;
