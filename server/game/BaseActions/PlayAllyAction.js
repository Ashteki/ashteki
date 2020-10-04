const Costs = require('../costs');
const BasePlayAction = require('./BasePlayAction');

class PlayAllyAction extends BasePlayAction {
    constructor(card) {
        super(card, [Costs.play()]);
        this.title = 'Play this ally';
    }

    addSubEvent(event, context) {
        let action = context.game.actions.putIntoPlay({ myControl: true });
        action.preEventHandler(context);
        event.addChildEvent(action.getEvent(context.source, context));
    }
}

module.exports = PlayAllyAction;
