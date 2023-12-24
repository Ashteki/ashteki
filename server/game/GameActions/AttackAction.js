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
            attacker: this.attacker
        };
        return super.createEvent('unnamedevent', params, (event) => {
            if (PhoenixbornTypes.includes(event.card.getType())) {
                event.context.game.initiatePBAttack(event.card, event.attacker);
            } else {
                event.context.game.initiateUnitAttack(event.card, event.attacker);
            }
        });
    }

    checkEventCondition(event) {
        // check the attacker is still in play
        return event.attacker.location === 'play area';
    }
}

module.exports = AttackAction;
