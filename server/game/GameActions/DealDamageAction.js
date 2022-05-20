// const Card = require('../Card');
const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.fightEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.purge = false;
        this.ignoreArmor = false;
        this.bonus = false;
        this.showMessage = false;
        this.unpreventable = false;
    }

    setup() {
        this.targetType = ['Ally', 'Conjuration', 'Phoenixborn'];
        this.name = 'damage';
        this.effectMsg = 'deal ' + (this.amount ? this.amount + ' ' : '') + 'damage to {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        return super.getEventArray(context);
    }

    getEvent(card, context, amount = this.amount) {
        const params = {
            card: card,
            context: context,
            amount: amount,
            damageSource: this.damageSource || context.source,
            damageType: this.damageType,
            destroyEvent: null,
            fightEvent: this.fightEvent,
            ignoreArmor: this.ignoreArmor,
            bonus: this.bonus
        };
        // preventable by default. check restrictions if it's a fight
        params.preventable = this.fightEvent
            ? card.controller.checkRestrictions('preventFightDamage', context)
            : true;

        // add unpreventable flags and restrictions
        params.preventable =
            params.preventable &&
            !(this.unpreventable || params.damageSource.anyEffect('unpreventable'));

        if (params.preventable) {
            if (card.anyEffect('preventAllDamage', context)) {
                let preventer = card.getEffects('preventAllDamage')[0];
                context.game.addMessage('{0} prevents damage to {1}', preventer, card);

                // add preventer and card as params when this matters
                return context.game.getEvent('onDamagePrevented');
            }

            if (card.anyEffect('preventDamage')) {
                let preventAmount = card.sumEffects('preventDamage');
                params.amount = params.amount - preventAmount;
            } else if (card.anyEffect('preventNonAttackDamage') && !this.fightEvent) {
                let preventAmount = card.sumEffects('preventNonAttackDamage');
                params.amount = params.amount - preventAmount;
            }
        }

        // Armour and Unpreventable damage (e.g. fallen)
        if (params.preventable && !params.ignoreArmor) {
            const damagePrevented = amount <= card.armor ? amount : card.armor;
            params.amount -= damagePrevented;
        }

        return super.createEvent('onDamageDealt', params, (damageDealtEvent) => {
            let damageAppliedParams = {
                amount: damageDealtEvent.amount,
                card: damageDealtEvent.card,
                context: damageDealtEvent.context,
                condition: (event) => event.amount > 0,
                noGameStateCheck: true,
                damageEvent: damageDealtEvent
            };
            let damageAppliedEvent = super.createEvent(
                'onDamageApplied',
                damageAppliedParams,
                (event) => {
                    let numTokens = event.amount;
                    if (event.card.anyEffect('multiplyDamage')) {
                        numTokens = event.amount * event.card.sumEffects('multiplyDamage');
                    }
                    // add tokens to victim - turn this into an event / use addtoken action
                    let tokenEvent = context.game.actions
                        .addToken({
                            type: 'damage',
                            amount: numTokens,
                            damageDealtEvent: event.damageEvent
                        })
                        .getEvent(event.card, context.game.getFrameworkContext(context.player));

                    tokenEvent.noGameStateCheck = true;
                    tokenEvent.openReactionWindow = true;
                    event.addSubEvent(tokenEvent);

                    if (this.showMessage) {
                        context.game.addMessage('{0} takes {1} damage', event.card, event.amount);
                    }
                }
            );
            damageDealtEvent.addSubEvent(damageAppliedEvent);

            // quickstrike in a fight skips counter damage
            if (
                // this is an attacking damage event
                damageDealtEvent === damageDealtEvent?.fightEvent?.attackerDamageEvent &&
                damageDealtEvent?.fightEvent?.attacker?.attacksFirst() &&
                this.damageWillDestroyTarget(damageDealtEvent.amount, damageDealtEvent.card) &&
                damageDealtEvent.fightEvent.counterDamageEvent
            ) {
                damageDealtEvent.fightEvent.counterDamageEvent.cancel();
            }
        });
    }

    damageWillDestroyTarget(attackerAmount, target) {
        let amountReceived = attackerAmount;
        if (target.anyEffect('multiplyDamage')) {
            amountReceived = amountReceived * target.sumEffects('multiplyDamage');
        }
        return amountReceived + target.damage - target.armor >= target.life;
    }
}

module.exports = DealDamageAction;
