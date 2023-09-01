const { Costs } = require('../costs');
const BasePlayAction = require('./BasePlayAction');

class PlayAllyAction extends BasePlayAction {
    constructor(card) {
        super(card, [Costs.play()]);
        this.title = 'Play this ally';
    }

    addSubEvent(event, context) {
        let action = context.game.actions.putIntoPlay({ myControl: true });
        if (context.player.isBattlefieldFull()) {
            context.game.addMessage(
                "{0}'s battlefield is full. {1} is discarded.",
                context.player,
                context.source
            );
            action = context.game.actions.discard();
        }
        // action.preEventHandler(context);
        event.addChildEvent(action.getEvent(context.source, context));
    }

    getWarnings(context) {
        return context.player.isBattlefieldFull() && 'Your battlefield is full.';
    }
}

module.exports = PlayAllyAction;
