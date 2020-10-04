const Costs = require('../costs');
const BasePlayAction = require('./BasePlayAction');

class PlayArtifactAction extends BasePlayAction {
    constructor(card) {
        super(card, [Costs.play(), Costs.mainAction()]);
        this.title = 'Play this artifact';
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
    }
}

module.exports = PlayArtifactAction;
