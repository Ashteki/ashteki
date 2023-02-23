const { BattlefieldTypes, PhoenixbornTypes, CardType } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class TriggerUltimateAction extends CardGameAction {
    setDefaultProperties() {

    }

    setup() {
        this.targetType = [CardType.Chimera];
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context
        };
        return super.createEvent('unnamedevent', params, (event) => {
            event.card.tokens.redRains = 0;
        });
    }
}

module.exports = TriggerUltimateAction;
