/* eslint-disable prettier/prettier */
const CardGameAction = require('./CardGameAction');

class ResolveFightAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.attacker = null; // this should be populated from propertyFactory object merge (in super)
    }

    setup() {
        this.name = 'attack';
        this.targetType = ['Ally', 'Conjuration'];
        this.effectMsg = 'make {1} fight {0}';
        this.effectArgs = this.attacker;
    }

    canAffect(card, context) {
        if (
            !this.attacker || // don't have an attacker
            card.location !== 'play area' || // target is not in the play area
            this.attacker.location !== 'play area' // attacker is not in the play area (weird?)
        ) {
            return false;
        } else if (
            !this.attacker.checkRestrictions('fight') || // attacker not allowed to fight
            card.controller === this.attacker.controller // the attacker is not ours
        ) {
            return false;
        }
        // TAUNT - remove this when combat done
        // else if (
        //     !card.checkRestrictions('attackDueToTaunt') &&
        //     !this.attacker.ignores('taunt') &&
        //     context.stage !== 'effect' // ??
        // ) {
        //     return false;
        // }

        return card.checkRestrictions(this.name, context) && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = {
            card: card,
            context: context,
            condition: (event) =>
                event.attacker.location === 'play area' && event.card.location === 'play area',
            attacker: this.attacker,
            attackerClone: this.attacker.createSnapshot(),
            attackerTarget: card,
            defenderTarget: this.attacker,
            destroyed: []
        };
        return super.createEvent('onFight', params, (event) => {
            if (!this.canAffect(event.card, event.context)) {
                event.card.elusiveUsed = true;
                return;
            }

            let defenderAmount = event.card.attack;
            if (event.card.anyEffect('limitFightDamage')) {
                defenderAmount = Math.min(
                    defenderAmount,
                    ...event.card.getEffects('limitFightDamage')
                );
            }

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

            let defenderParams = {
                amount: defenderAmount,
                fightEvent: event,
                damageSource: event.card
            };

            let damageEvent;
            // replace this check for elusive with
            if (this.notElusive(event)) {
                if (
                    // defender deals damage in return IF the attacker hasn't got skirmish,
                    // AND the attacker is still the defender's target (this could be switched in beforeFight interrupts)
                    (!event.attacker.getKeywordValue('skirmish') ||
                        event.defenderTarget !== event.attacker) &&
                    event.card.checkRestrictions('dealFightDamage') && // declared target can deal damage
                    event.attackerTarget.checkRestrictions('dealFightDamageWhenDefending') // or defender can't deal damage when defending
                ) {
                    // Counter damage event
                    damageEvent = context.game.actions
                        .dealDamage(defenderParams)
                        .getEvent(event.defenderTarget, context);
                }

                // if attacker CAN dealFightDamage
                if (event.attacker.checkRestrictions('dealFightDamage')) {
                    // if there is damage from the defender
                    if (damageEvent) {
                        // append this to the existing COUNTER event
                        damageEvent.addChildEvent(
                            context.game.actions
                                .dealDamage(attackerParams)
                                .getEvent(event.attackerTarget, context)
                        );
                    } else {
                        // there's not COUNTER event, so set to be the damageEvent
                        damageEvent = context.game.actions
                            .dealDamage(attackerParams)
                            .getEvent(event.attackerTarget, context);
                    }
                }
            } else if (
                event.attackerTarget !== event.card &&
                event.attacker.checkRestrictions('dealFightDamage')
            ) {
                // defender IS elusive. however, attackerTarget is NOT the declared target defender,
                // so deal some damage elsewhere. - in KeyForge the new target does not get to COUNTER
                damageEvent = context.game.actions
                    .dealDamage(attackerParams)
                    .getEvent(event.attackerTarget, context);

                // ... NO COUNTER ...
            }

            event.card.elusiveUsed = true;

            // If anyone is getting damaged...
            if (damageEvent) {
                // mark as fighting
                event.card.isFighting = true;
                event.attacker.isFighting = true;
                context.game.checkGameState(true); // ?? to check for pre-fight damage / deaths?
                damageEvent.openReactionWindow = false; // this damage event doesn't trigger reaction opportunities
                context.game.openEventWindow(damageEvent); // ?? err...
                context.game.queueSimpleStep(() => {
                    // add a new event to fire the damage event and
                    event.addChildEvent(damageEvent);
                    damageEvent.openReactionWindow = true;
                    event.card.isFighting = false;
                    event.attacker.isFighting = false;
                });
            }
        });
    }

    notElusive(event) {
        return (
            !event.card.getKeywordValue('elusive') ||
            event.card.elusiveUsed ||
            event.attacker.ignores('elusive')
        );
    }
}

module.exports = ResolveFightAction;
