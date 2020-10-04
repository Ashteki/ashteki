const Costs = require('../costs');
const BasePlayAction = require('./BasePlayAction');

class PlayReadySpellAction extends BasePlayAction {
    constructor(card) {
        super(card, [Costs.play()]);
        this.title = 'Play this ready spell';
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

module.exports = PlayReadySpellAction;
