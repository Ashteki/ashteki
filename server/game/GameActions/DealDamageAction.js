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
        this.bonus = false;
        this.showMessage = false;
        this.unpreventable = false;
    }

    setup() {
        this.targetType = [...BattlefieldTypes, 'Phoenixborn', 'Chimera'];
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
            amountDealt: amount,
            damageSource: this.damageSource || context.source,
            damageType: this.damageType,
            destroyEvent: null,
            fightEvent: this.fightEvent,
            bonus: this.bonus,
            sourceType: this.sourceType,
            multiEvent: this.multiEvent
        };
        // preventable by default. check restrictions if it's a fight
        params.preventable = this.fightEvent
            ? card.controller.checkRestrictions('preventFightDamage', context)
            : true;

        // add unpreventable flags and restrictions
        params.preventable =
            params.preventable &&
            !(this.unpreventable || params.damageSource.anyEffect('unpreventable'));

        params.condition = (event) => this.canDealDamage(event.damageSource, event);

        return super.createEvent('onDamageDealt', params, (damageDealtEvent) => {
            let damageAppliedParams = Object.assign(params, {
                condition: (event) => event.amount > 0,
                damageEvent: damageDealtEvent,
                noGameStateCheck: true
            });
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

    canDealDamage(source, event) {
        return (
            // it's not a card effect
            !Object.values(CardType).includes(source.type) ||
            // it's not a unit in the wrong place
            !(
                BattlefieldTypes.includes(source.type) &&
                !DamageDealingLocations.includes(source.location)
            )
            &&
            !event.fightEvent?.attackerDamageEvent?.destroyEvent
        );
    }
}

module.exports = DealDamageAction;
