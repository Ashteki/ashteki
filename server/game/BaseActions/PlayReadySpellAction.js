const { Costs } = require('../costs');
const ActionCost = require('../Costs/actioncost');
const BasePlayAction = require('./BasePlayAction');

class PlayReadySpellAction extends BasePlayAction {
    constructor(card, payActionCost = true) {
        super(card, [Costs.play()]);
        if (!payActionCost) {
            this.cost = this.cost.filter((c) => !(c instanceof ActionCost));
        }

        this.title = 'Play this ready spell';
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

module.exports = PlayReadySpellAction;
