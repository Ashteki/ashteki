const { BattlefieldTypes, PhoenixbornTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AttackAction extends CardGameAction {
    setDefaultProperties() {
        this.attacker = null;
    }

    setup() {
        this.targetType = [...BattlefieldTypes, ...PhoenixbornTypes];
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context,
            attackers: Array.isArray(this.attacker) ? this.attacker : [this.attacker]
        };
        return super.createEvent('unnamedevent', params, (event) => {
            if (params.attackers && !params.attackers.some((attacker) => attacker.canAttack())) {
                return;
            }

            if (PhoenixbornTypes.includes(event.card.getType())) {
                event.context.game.initiatePBAttack(event.card, event.attackers);
            } else {
                event.context.game.initiateUnitAttack(event.card, event.attackers);
            }
        });
    }

    checkEventCondition(event) {
        // check the attacker is still in play
        if (Array.isArray(event.attackers)) {
            return event.attackers.some(attacker => attacker.location === 'play area');
        }
        return event.attackers.location === 'play area';
    }
}

module.exports = AttackAction;
