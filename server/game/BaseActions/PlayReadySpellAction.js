const ActionCost = require('../Costs/actioncost');
const { Costs } = require('../costs');
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
        let action = context.game.actions.putIntoPlay({ myControl: true });
        if (context.player.isSpellboardFull() &&
            !context.source.isPlayedToExistingSpellboardSlot) {
            context.game.addMessage(
                "{0}'s battlefield is full. {1} is discarded.",
                context.player,
                context.source
            );
            action = context.game.actions.discard();
        }

        event.addChildEvent(action.getEvent(context.source, context));
    }

    getWarnings(context) {
        if (context.player.isSpellboardFull() && !context.source.isPlayedToExistingSpellboardSlot) {
            return 'Your spellboard is full.';
        }

        return super.getWarnings(context);
    }
}

module.exports = PlayReadySpellAction;
