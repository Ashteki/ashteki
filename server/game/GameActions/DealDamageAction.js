const { CardType, DamageDealingLocations, BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class DealDamageAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.fightEvent = null;
        this.damageSource = null;
        this.sourceType = '';
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
            bonus: this.bonus,
            sourceType: this.sourceType
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

        params.condition = (event) => this.canDealDamage(event.damageSource);

        return super.createEvent('onDamageDealt', params, (damageDealtEvent) => {
            let damageAppliedParams = {
                amount: damageDealtEvent.amount,
                card: damageDealtEvent.card,
                context: damageDealtEvent.context,
                condition: (event) => event.amount > 0,
                noGameStateCheck: true,
                damageEvent: damageDealtEvent,
                preventable: damageDealtEvent.preventable
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
        });
    }

    canDealDamage(source) {
        return (
            // it's not a card effect
            !Object.values(CardType).includes(source.type) ||
            // it's not a unit in the wrong place
            !(
                BattlefieldTypes.includes(source.type) &&
                !DamageDealingLocations.includes(source.location)
            )
        );
    }
}

module.exports = DealDamageAction;
