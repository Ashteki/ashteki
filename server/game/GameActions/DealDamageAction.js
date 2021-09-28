// const Card = require('../Card');
const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.amountForCard = () => 1;
        this.fightEvent = null;
        this.damageSource = null;
        this.damageType = 'card effect';
        this.splash = 0;
        this.purge = false;
        this.ignoreArmor = false;
        this.bonus = false;
        this.showMessage = false;
        this.unpreventable = false;
    }

    setup() {
        this.targetType = ['Ally', 'Conjuration', 'Phoenixborn'];
        this.name = 'damage';
        this.effectMsg =
            'deal ' +
            (this.amount ? this.amount + ' ' : '') +
            'damage to {0}' +
            (this.splash ? ' and ' + this.splash + ' to their neighbors' : '');
    }

    canAffect(card, context) {
        if (this.amount === 0 || (!this.amount && this.amountForCard(card, context) === 0)) {
            return false;
        }

        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        if (this.splash) {
            return this.target
                .filter((card) => this.canAffect(card, context))
                .reduce(
                    (array, card) =>
                        array.concat(
                            this.getEvent(card, context),
                            card.neighbors.map((neighbor) =>
                                this.getEvent(neighbor, context, this.splash)
                            )
                        ),
                    []
                );
        }

        return super.getEventArray(context);
    }

    getEvent(card, context, amount = this.amount || this.amountForCard(card, context)) {
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

            if (damageDealtEvent.ignoreArmor || !damageDealtEvent.preventable) {
                damageDealtEvent.addSubEvent(damageAppliedEvent);
            } else {
                let armorPreventParams = {
                    card: damageDealtEvent.card,
                    context: damageDealtEvent.context,
                    amount: damageDealtEvent.amount,
                    noGameStateCheck: true
                };
                let armorPreventEvent = super.createEvent(
                    'onDamagePreventedByArmor',
                    armorPreventParams,
                    (event) => {
                        if (amount <= event.card.armor) {
                            event.damagePrevented = event.amount;
                        } else {
                            event.damagePrevented = event.card.armor;
                        }

                        damageAppliedEvent.amount -= event.damagePrevented;
                        damageDealtEvent.amount -= event.damagePrevented;
                        damageDealtEvent.addSubEvent(damageAppliedEvent);
                    }
                );
                damageDealtEvent.addSubEvent(armorPreventEvent);
                armorPreventEvent.openReactionWindow = true;
            }
        });
    }
}

module.exports = DealDamageAction;
