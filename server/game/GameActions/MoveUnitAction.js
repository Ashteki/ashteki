const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class MoveUnitAction extends CardGameAction {
    setDefaultProperties() {
        this.to = 'right';
    }

    setup() {
        this.name = 'moveUnit';
        this.targetType = BattlefieldTypes;
    }

    canAffect(card, context) {
        if ('play area' !== card.location) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onUnitMoved', { card: card, context: context }, (event) => {
            card.controller.moveUnit(card, 'right');
            context.game.addMessage('{0} is moved to the {1}', card, this.to);
            context.game.queueUserAlert(context, {
                promptTitle: context.source.name,
                menuTitle: `${context.source.name} moves ${event.card.name} to the ${this.to}most position`,
                controls: [
                    {
                        type: 'targeting',
                        source: context.source.getShortSummary(),
                        targets: [event.card.getShortSummary()]
                    }
                ]
            });
        });
    }
}

module.exports = MoveUnitAction;
