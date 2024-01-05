const BasePlayAction = require('./BasePlayAction');
const AttachToPbAction = require('../GameActions/AttachToPbAction');

class PlayPbUpgradeAction extends BasePlayAction {
    constructor(card) {
        super(card, {
            autoTarget: card.autoTarget ? card.autoTarget : (context) => context.player.phoenixborn,
            gameAction: new AttachToPbAction((context) => ({ upgrade: context.source }))
        });
        this.title = 'Play this alteration';
    }

    displayMessage(context) {
        if (context.target) {
            context.game.addMessage(
                '{0} plays {1} attaching it to {2}',
                context.player,
                context.source,
                context.target
            );
        } else {
            context.game.addMessage(
                '{0} plays {1} and it is discarded',
                context.player,
                context.source
            );
        }
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            new AttachToPbAction({ upgrade: context.source }).getEvent(context.target, context)
        );
    }
}

module.exports = PlayPbUpgradeAction;
