const { CardType } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AttackAction extends CardGameAction {
    setDefaultProperties() {
        this.attacker = null;
    }

    setup() {
        this.targetType = ['Ally', 'Conjuration', CardType.Phoenixborn];
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
            if (event.card.type === CardType.Phoenixborn) {
                event.context.game.initiatePBAttack(event.card, event.attacker);
            } else {
                event.context.game.initiateUnitAttack(event.card, event.attacker)
            }
        });
    }
}

module.exports = AttackAction;
