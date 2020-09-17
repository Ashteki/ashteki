const Costs = require('../costs');
const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card, [Costs.play(), Costs.spendMainAction()]);
        this.title = 'Play this artifact';
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

module.exports = PlayAction;
