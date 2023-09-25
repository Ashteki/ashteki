const ActionCost = require('../Costs/actioncost');
const BasePlayAction = require('./BasePlayAction');

class PlayReadySpellAction extends BasePlayAction {
    constructor(card, payActionCost = true) {
        super(card);
        if (!payActionCost) {
            this.cost = this.cost.filter((c) => !(c instanceof ActionCost));
        }

        this.title = 'Play this ready spell';
    }

    addSubEvent(event, context) {
        let action = context.game.actions.putIntoPlay({ myControl: true });
        if (!context.player.canPlayToSpellboard(context.source)) {
            context.game.addMessage(
                "Cannot play {1} to {0}'s spellboard. It is discarded.",
                context.player,
                context.source
            );
            action = context.game.actions.discard();
        }

        event.addChildEvent(action.getEvent(context.source, context));
    }

    getWarnings(context) {
        if (!context.player.canPlayToSpellboard(context.source)) {
            return `Ready Spell will be discarded.`;
        }

        return super.getWarnings(context);
    }
}

module.exports = PlayReadySpellAction;
